import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import {Paper} from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton';
const moment = require('moment')

const styles = {
  cardStyle: {
    marginTop: 10
  },
  albumArt: {
    width: '50%'
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
    height: '48px',
    width: '48px'
  }
}

export default class Share extends React.Component {
  constructor(props){
    super(props)
    this.playTrack = this.playTrack.bind(this)
    this.state = {
      post: props.post,
      key: props.theKey,
      getTrackDetails: props.getTrackDetails,
      playTrack: props.playTrack,
      getAvatarUrl: props.getAvatarUrl,
      avatarUrl: null,
      commentCount: null,
      getComments: props.getComments
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
    this.state.playTrack(this.state.post.track)
  }

  getTrackDetails(){
    this.state.getTrackDetails(this.state.post.track)
    .then(res=>res.json())
    .then(res=>this.setState({track: res}))
  }

  getComments(){
    this.state.getComments(this.state.post.share_id)
    .then(res=>res.json())
    .then(res=>{
      console.log(res)
      this.setState({commentCount: res.length})})
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
    let {key, post, commentCount, track} = this.state
    return (
      <Card key={key} style={styles.cardStyle}>
        <CardHeader
          title={track ? track.name : ''}
          subtitle={track ? track.artists[0].name : '...'}
          avatar={track ? <img src={track.album.images[2].url} /> : ''}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardHeader 
          expandable={true}
          title={'shared by ' + post.name}
          subtitle={moment(post.timestamp).from(moment(post.timenow))}
          avatar={this.state.avatarUrl}
        />
        <CardActions style={styles.actions} expandable={true}>
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