export default class Api {
  getPosts(){
    return fetch('/api/posts')
  }

  getComments(shareId){
    return fetch(`/api/comments?shareId=${shareId}`)
  }

  updateToken(refresh_token){
    const url = `/refresh_token?refresh_token=${refresh_token}`
    return fetch(url)
  }
  shareTrack(currentTrack, userId){
    return fetch('/api/share?track=' + currentTrack + '&name=' + userId)
  }

  // spotify

  getNowPlaying(access_token){
    return fetch('https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      }
    )  
  }

  getAvatarUrl(userId, access_token){
    const url = 'https://api.spotify.com/v1/users/' + userId
    return fetch(url, {
      headers: {
          'Authorization': 'Bearer ' + access_token
        }
    })
  }

  getTrackDetails(trackId, access_token){
    const url = 'https://api.spotify.com/v1/tracks/' + trackId
    return fetch(url, {
      headers: {
          'Authorization': 'Bearer ' + access_token
        }
    })
  }

  playTrack(trackId, access_token){
    const url = 'https://api.spotify.com/v1/me/player/play/'
    return fetch(url, {
      method: 'PUT',
      headers: {
          'Authorization': 'Bearer ' + access_token
        },
      body: JSON.stringify({"uris":[
        "spotify:track:" + trackId]
      })
    })
  }

}