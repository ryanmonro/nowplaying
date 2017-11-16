
(()=>{
  var database = require('./database')
  var spotifyLib = require('./spotify')

  var api = {
    getPosts: function(req, res){
      database.getPosts()
      .then(function(data) {
        res.json(data);
      })
      .catch(function(error) {
          console.log('error fetching posts', error)
      })
    },
    createComment: function(req, res){
      var userId = req.query.userId || null
      var shareId = req.query.shareId || null
      // todo
      console.log(userId, shareId)
    },
    createShare: function(req, res){
      let name = req.query.name || null
      let track = req.query.track || null

      database.getInsertUserId(name)
        .then(userId => {
          console.log(name + " has id of " + userId)
          database.getInsertTrackId(track)
            .then(trackId => {
              console.log(track + " has id of " + trackId)
              database.createShare()
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
    }
  }

  var spotify = {
    login: function(request, response){
      spotifyLib.login(request, response)
    },
    callback: function(req, res) {
      spotifyLib.callback(req, res)
    },
    refresh_token: function(req, res){
      spotifyLib.refresh_token(req, res)
    }
  }

  
  module.exports = {
    api: api,
    spotify: spotify
  }
})()