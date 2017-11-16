(()=>{
  var Chance = require('chance');
  var chance = new Chance();
  var request = require('request');
  var querystring = require('querystring');
  // Spotify credentials
  const stateKey = 'spotify_auth_state';
  const client = {
    clientId: '068c62453a994ed3831a45fab8bd2b87',
    secretId: process.env.SECRET_KEY,
    scope: 'user-read-currently-playing',
    redirect: process.env.SPOTIFY_CALLBACK || 'http://localhost:3001/callback'
  }

  function login(request, response){
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
  }

  function callback(req, res){
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
  }

  function refresh_token(req, res){
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
  }

  module.exports = {
    login: login,
    callback: callback,
    refresh_token: refresh_token
  }
})()