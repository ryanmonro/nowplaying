import React from 'react'
import Avatar from './Avatar'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

export default class Share extends React.Component {
  constructor(props){
    super(props)
    this.playTrack = this.playTrack.bind(this)
    this.state = {
      post: props.post,
      key: props.theKey,
      access_token: props.access_token,
      getTrackDetails: props.getTrackDetails,
      playTrack: props.playTrack,
      getAvatarUrl: props.getAvatarUrl,
      avatarUrl: null
    }
  }

  componentDidMount(){
    this.getTrackDetails()
    this.getAvatarUrl()
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

  getAvatarUrl(){
    this.state.getAvatarUrl(this.state.post.name)
    .then(res=>res.json())
    .then(res=> {
      const images = res.images || []
      if(images.length){
        let imgUrl = res.images[0].url
        this.setState({avatarUrl: imgUrl})
      }
    })
  }

  render(){
    let {key, post, track} = this.state
    return (
      <Card key={key}>
        <CardHeader
          title={track ? track.name : ''}
          subtitle={track ? track.artists[0].name : '...'}
          avatar={this.state.avatarUrl}
          actAsExpander={true}
          showExpandableButton={true}
        />
        
         
        
      
      </Card>
    )
  }
}

// {track ? <img src={track.album.images[2].url} alt='album art' title={track.album.name}/> : ''}

/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/