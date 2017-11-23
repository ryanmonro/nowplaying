import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'
import {Card, CardActions, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton'
import {deepOrange500} from 'material-ui/styles/colors'
import Avatar from './Avatar'
import Player from './Player'
import Share from './Share'
import Api from './Api.js'

const api = new Api()

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#6AE368', // spotify green
  },
});

const styles = {
  appBar: {
    textAlign: 'center'
  },
  nowPlayingCard: {
    padding: '15px',
    textAlign: 'center'
  }
}

class Login extends Component {
    static muiName = 'RaisedButton';
    render() {
      return (
        <RaisedButton 
          label="Log In with Spotify"
          href="/login"
          target="_self"
        />
      )
    }
  }

class App extends Component {
  constructor(props){
    super(props)
    this.share = this.share.bind(this)
    this.getNowPlaying = this.getNowPlaying.bind(this)
    this.getTrackDetails = this.getTrackDetails.bind(this)
    this.playTrack = this.playTrack.bind(this)
    this.getAvatarUrl = this.getAvatarUrl.bind(this)
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
  }

  componentDidMount(){

    if (this.state.loggedin){ 
      this.getPosts()
      this.getNowPlaying()
      setInterval(()=>{
        this.getNowPlaying()
        this.getPosts()
      }, 10000)
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
      } else if (res.status === 401){
        this.updateToken()
      } else {
        this.setState({playing: false, currentTrack: null})
      }
    })
  }

  getPosts(){
    api.getPosts()
    .then(res=>res.json())
    .then(res=>this.setState({posts: res}))
  }

  getComments(shareId){
    return api.getComments(shareId)
  }

  getTrackDetails(track){
    return api.getTrackDetails(track, this.state.access_token)
  }

  playTrack(track){

    api.playTrack(track, this.state.access_token)
    .then(this.getNowPlaying)
  }

  getAvatarUrl(userId){
    return api.getAvatarUrl(userId, this.state.access_token)
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
    <MuiThemeProvider muiTheme={muiTheme}>
      
        <AppBar 
          title="NowPlaying" 
          style={styles.appBar}
          showMenuIconButton={false}
          iconElementRight={loggedin ? <Avatar userId={userId} access_token={access_token}/> : '' }
        />
          <Card style={styles.nowPlayingCard}>
            {playing ? 
            <CardMedia>
              <Player track={currentTrack} /> 
            </CardMedia> : '' }
            <CardActions>
              {playing ? 
              <RaisedButton primary={true} onClick={this.share} label="Share!" />
              : <Login />}
            </CardActions>
          </Card> 
        <main id="feed" className={loggedin ? '' : 'hidden'}>
          { posts.map((post, key) => 
            <Share 
              post={post} 
              key={post.share_id} 
              theKey={post.share_id} 
              getTrackDetails={this.getTrackDetails} 
              playTrack={this.playTrack}
              getAvatarUrl={this.getAvatarUrl}
              getComments={this.getComments}
            />)}
        
        </main>
    </MuiThemeProvider>
    );
  }
}

export default App;