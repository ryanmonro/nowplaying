import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
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

  commentsItems(){
    let comments = this.state.comments.map((comment, key) =>
      <ListItem
        value={key}
        primaryText={comment.body}
        secondaryText={<p>{moment(comment.timestamp).from(moment(comment.timenow))}</p>}
        secondaryTextLines={2}
        leftAvatar={<Avatar src={this.state.avatarUrl}
        /> }
      />)
    let output = 
    [<ListItem>
      <TextField hintText="Enter comment" name="comment"/>
      <RaisedButton style={{marginLeft: 10}}label="Post" />
    </ListItem>]
    if (comments.length > 0){
      output.unshift(comments)
    }
    return output
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
    let {key, post, track, comments} = this.state
    let hasComments = comments.length > 0
    return (
      <ListItem 
        key={key} 
        style={styles.cardStyle}
        hoverColor={'white'}
        primaryTogglesNestedList={true}
        primaryText={track ? track.name : ''}
        secondaryText={<p><b>{track ? track.artists[0].name : '...'}</b><br/>Shared by {post.name} {moment(post.timestamp).from(moment(post.timenow))} {hasComments ? " (" + comments.length + " comments)" : ''}</p>}
        secondaryTextLines={2}
        leftAvatar={track ? <Avatar src={track.album.images[2].url} /> : ''}
        rightIconButton={<FloatingActionButton mini={true} onClick={this.playTrack}><AvPlayArrow/></FloatingActionButton>}
        // nestedItems={this.commentsItems()}
      />
    )
  }
}

// nestedItems={ 

//           />)}


/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/