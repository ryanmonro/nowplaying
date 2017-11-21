import React from 'react'
import Avatar from './Avatar'

export default class Share extends React.Component {
  constructor(props){
    super(props)
    this.playTrack = this.playTrack.bind(this)
    this.state = {
      post: props.post,
      key: props.theKey,
      access_token: props.access_token,
      getTrackDetails: props.getTrackDetails,
      playTrack: props.playTrack
    }
  }

  componentDidMount(){
    this.getTrackDetails()
  }

  playTrack(event){
    event.preventDefault()
    this.state.playTrack(this.state.post.track)
  }

  getTrackDetails(){
    this.state.getTrackDetails(this.state.post.track)
    .then(res=>res.json())
    .then(res=>this.setState({track: res}))
  }

  render(){
    let {key, post, access_token, track} = this.state
    return (
      <div key={key} className="share">
        <Avatar userId={post.name} theKey={key} access_token={access_token}/>
        {track ? <img src={track.album.images[2].url} alt='album art' title={track.album.name}/> : ''}
        {track ? <a href="#" onClick={this.playTrack}>{track.artists[0].name} - </a> : '...'} 
        {track ? track.name : ''}
      </div>
    )
  }
}

/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/