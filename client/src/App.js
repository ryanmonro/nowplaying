import React, { Component } from 'react';
import './App.css';
import './backend.js'
import Avatar from './Avatar'
import Player from './Player'
import Share from './Share'

class App extends Component {
  constructor(props){
    super(props)

    this.share = this.share.bind(this)
    this.updateNowPlaying = this.updateNowPlaying.bind(this)
    const hashParams = this.getHashParams()
    this.state = {
      loggedin: hashParams.id && hashParams.access_token,
      playing: false,
      currentTrack: null,
      userId: hashParams.id,
      posts: [],
      access_token: hashParams.access_token,
      refresh_token: hashParams.refresh_token
    }
    this.getPosts()
    if (this.state.loggedin){
      
      this.getNowPlaying()
      setInterval(this.updateNowPlaying, 10000)
    }
  }

  getHashParams(){
    let hash = window.location.hash.substring(1).split('&')
    let output = {}
    hash.forEach(function(thisHash){
      let pair = thisHash.split('=')
      output[pair[0]] = pair[1]
    })
    return output
  }

  callSpotify() {
    // requesting access token from refresh token
    const url = `/refresh_token?refresh_token=${this.state.refresh_token}`
    fetch(url)
    .then(res => res.json())
    .then(res => this.setState({access_token: res.access_token}))
  }

  getPosts(){
    fetch('/api/posts')
    .then(res=>res.json())
    .then(res=>this.setState({posts: res}))
  }

  getNowPlaying(){
    fetch('https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': 'Bearer ' + this.state.access_token
        }
      }
    )
    .then(res=>res.json())
    .then(res=> { 
      let currentTrack = res.item.id
      this.setState({playing: true, currentTrack: currentTrack})
    })
  }

  updateNowPlaying(){
    fetch('https://api.spotify.com/v1/me/player/currently-playing',
      {
        headers: {
          'Authorization': 'Bearer ' + this.state.access_token
        }
      }
    )
    .then(res=>res.json())
    .then(res=> { 
      let oldTrack = this.state.currentTrack
      let currentTrack = res.item.id
      if (oldTrack !== currentTrack) {
        this.setState({playing: true, currentTrack: currentTrack})
      }
    })
  }

  share(e){
    let {currentTrack, userId, posts} = this.state 
    fetch('/api/share?track=' + currentTrack + '&name=' + userId)
    .then(res=>res.json())
    .then(res=> { console.log(res)
      let newShare = {
        name: userId,
        track: currentTrack,
        comments: []
      }
      posts.unshift(newShare)
      this.setState({posts: posts})
    })
  }

  render() {
    let {loggedin, playing, userId, avatarUrl, access_token, posts, currentTrack} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">NowPlaying</h1>
          <div id="login" className={loggedin ? 'hidden' : ''}>
            <p><a href='/login' target="_self">Log In with Spotify</a></p>
          </div>
          <div id="loggedin" className={loggedin ? '' : 'hidden'}>
            logged in as <span className="username">{userId}</span>
            <div id="myavatar">
              {loggedin ? <Avatar userId={userId} access_token={access_token}/> : ''}
            </div>
          </div>
          <div id="nowplaying" className={playing ? '' : 'hidden'}>
            {playing ? <Player track={currentTrack} /> : ''}
            <button onClick={this.share}>Share!</button>
          </div>
        </header>
        <main>
        <div id="feed">
          {posts.map((post, key) => <Share post={post} key={key}access_token={access_token} />)}
        </div>
        </main>
      </div>
    );
  }
}

export default App;
