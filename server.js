var express = require('express');
var app = express();
var ChanceLib = require('chance');
var chance = new ChanceLib();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const pgp = require('pg-promise')();

const PORT = 3001;

// Database
const connection = process.env.DATABASE_URL || {
  host: 'localhost',
  port: 5432,
  database: 'nowplaying_dev'
}

const db = pgp(connection);

// Spotify credentials
const stateKey = 'spotify_auth_state';
const client = {
  clientId: '068c62453a994ed3831a45fab8bd2b87',
  secretId: '1191604707c749d9bcdb1e45304cfb41',
  scope: 'user-read-currently-playing',
  redirect: 'http://localhost:3001/callback'
}

// Middleware starts here
// app.set('views', './views');
// app.set('view engine', 'ejs');

app.use(cookieParser());


// Routes

// app.get('/index.html', function(request, response){
//   response.send('hey')
//   // response.sendFile('client/build/index.html');
// })
app.use(express.static('client/build/'));

// Spotify authorization
app.get('/login', function(request, response){
  console.log('login')
  var state = chance.string({ length: 16 })
  response.cookie(stateKey, state);
  response.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client.clientId,
      scope: client.scope,
      redirect_uri: client.redirect,
      state: state
    })
  );
})


app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: client.redirect,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client.clientId + ':' + client.secretId).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          // pass access, refresh and id back to client
          res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            id: body.id
          }));
        });


      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client.clientId + ':' + client.secretId).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

// API Routes
app.get('/api/share', function(req, res){
  let name = req.query.name || null
  let track = req.query.track || null

  getInsertUserId(name)
    .then(userId => {
      console.log(name + " has id of " + userId)
      getInsertTrackId(track)
        .then(trackId => {
          console.log(track + " has id of " + trackId)
          db.none('INSERT INTO shares(user_id, track_id, created_at, updated_at) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [userId, trackId])
            .then(() => {
                console.log('successfully added new share! :tada:')
                res.json({success: true})
            })
            .catch(error => {
                console.log('failed adding new share')
          });
        })
        .catch(error => {
          console.log('getting track id failed')
      });  
    })
    .catch(error => {
        console.log('getting user id failed')
  });
})

app.get('/api/comment', function(req, res){
  // user_id, share_id, body, created_at, updated_at
  var userId = req.query.userId || null
  var shareId = req.query.shareId || null
  console.log(userId, shareId)
})

app.get('/api/posts', function(req, res){
  db.any('SELECT users.name AS name, tracks.spotify_id AS track, shares.id AS share_id, shares.created_at AS timestamp FROM shares, tracks, users, comments WHERE shares.track_id = tracks.id AND shares.user_id = users.id ORDER BY timestamp DESC')
    .then(function(data) {
      // results = {}
      // data.forEach(function(row){
      //   {}
      // })

      res.json(data);
    })
    .catch(function(error) {
        console.log('error fetching posts', error)
    });
  // var posts = [
  //   {
  //     name: 'luckyluke',
  //     track: '3C88onjSPfnDW2xgDGmKRg',
  //     comments: [
  //       {
  //         name: 'ryanmonro',
  //         body: 'sweet!'
  //       }
  //     ]
  //   },
  //   {
  //     name: '1241373202',
  //     track: '73bDvrmSBh2fr53tLDH9oA',
  //     comments: [
  //       {
  //         name: 'dave',
  //         body: 'nice choice'
  //       },
  //       {
  //         name: 'somebody',
  //         body: 'I like it'
  //       }
  //     ]
  //   },
  //   {
  //     name: '1266416371',
  //     track: '2wRXbDpe0Uv0ebgsCSkXHO',
  //     comments: []
  //   }
  // ]
  // res.json(posts);
})

//
// database
// 

function getInsertUserId(name) {
  return db.task('getInsertUserId', t => {
    return t.oneOrNone('SELECT id FROM users WHERE name = $1', [name], u => u && u.id)
      .then(userId => {
        return userId || t.one('INSERT INTO Users(name, created_at, updated_at) VALUES($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [name], u => u.id);
      });
  });
}

function getInsertTrackId(spotify_id) {
  return db.task('getInsertTrackId', t => {
    return t.oneOrNone('SELECT id FROM tracks WHERE spotify_id = $1', [spotify_id], u => u && u.id)
      .then(trackId => {
        return trackId || t.one('INSERT INTO tracks(spotify_id,  created_at, updated_at) VALUES($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [spotify_id], u => u.id);
      });
  });
}



app.listen(PORT);