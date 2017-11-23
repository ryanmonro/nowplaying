import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
const moment = require('moment')

const styles = {
  cardStyle: {
    marginTop: 10
  },
  actions: {
    textAlign: 'center'
  },
  avatar: {
    height: '48px',
    width: '48px',
    borderRadius: '50%'
  },
  album: {
    height: '96',
    width: '96'
  }
}

export default class Share extends React.Component {
  constructor(props){
    super(props)
    this.playTrack = this.playTrack.bind(this)
    this.state = {
      post: props.post,
      key: props.theKey,
      api: props.api,
      avatarUrl: null,
      comments: [],
      access_token: props.access_token
    }
  }

  componentDidMount(){
    this.getTrackDetails()
    this.getAvatarUrl()
    this.getComments()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.post.timenow !== this.state.post.timenow) {
      this.setState({post: nextProps.post});
    }
  }

  playTrack(event){
    event.preventDefault()
    this.state.api.playTrack(this.state.post.track, this.state.access_token)
  }

  getTrackDetails(){
    this.state.api.getTrackDetails(this.state.post.track, this.state.access_token)
    .then(res=>res.json())
    .then(res=>this.setState({track: res}))
  }

  getComments(){
    this.state.api.getComments(this.state.post.share_id)
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
      this.setState({comments: res})})
  }

  getAvatarUrl(){
    this.state.api.getAvatarUrl(this.state.post.name, this.state.access_token)
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
      <Card key={key} style={styles.cardStyle}>
        <CardHeader
          title={track ? track.name : ''}
          subtitle={track ? track.artists[0].name : '...'}
          avatar={track ? <img src={track.album.images[2].url} alt="album artwork" title="" /> : ''}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardHeader 
          expandable={true}
          title={post.name}
          subtitle={moment(post.timestamp).from(moment(post.timenow))}
          avatar={this.state.avatarUrl}
          style={{marginLeft: 25}}
        />
        <CardActions
          expandable={true} 
          style={styles.actions}
        >
          <RaisedButton label="Play" onClick={this.playTrack}/>
        </CardActions>
      </Card>
    )
  }
}

/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/