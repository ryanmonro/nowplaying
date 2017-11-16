import React, { Component } from 'react';
import './App.css';
import './backend.js'
import Avatar from './Avatar'
import Player from './Player'
import Share from './Share'
import Api from './Api.js'
const api = new Api()

class App extends Component {
  constructor(props){
    super(props)
    this.share = this.share.bind(this)
    this.getNowPlaying = this.getNowPlaying.bind(this)
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

    api.getPosts()
    .then(res=>res.json())
    .then(res=>this.setState({posts: res}))

    if (this.state.loggedin){
      
      this.getNowPlaying()
      setInterval(this.getNowPlaying, 10000)
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

  updateToken() {
    // requesting access token from refresh token
    api.updateToken(this.state.refresh_token)
    .then(res => res.json())
    .then(res => this.setState({access_token: res.access_token}))
  }

  getNowPlaying(){
    api.getNowPlaying(this.state.access_token)  
    .then(res=>{ if (res.status === 200) {
        res.json().then(json=>{
          let currentTrack = json.item.id
          this.setState({playing: true, currentTrack: currentTrack})
        } 
      )
      } else {
        this.setState({playing: false, currentTrack: null})
      }
    })
  }

  share(e){
    let {currentTrack, userId, posts} = this.state 
    api.shareTrack(currentTrack, userId)
    .then(res=>res.json())
    .then(res=> { let newShare = {
        name: userId,
        track: currentTrack,
        share_id: Math.floor(Math.random() * 10000),
        comments: []
      }
      posts.unshift(newShare)
      this.setState({posts: posts})
    })
  }

  render() {
    let {loggedin, playing, userId, access_token, posts, currentTrack} = this.state
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
          {posts.map((post, key) => <Share post={post} key={post.share_id} theKey={post.share_id} access_token={access_token} />)}
        </div>
        </main>
      </div>
    );
  }
}

export default App;
