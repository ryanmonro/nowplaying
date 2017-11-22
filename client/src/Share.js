import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  cardStyle: {
    marginTop: 10
  },
  actions: {
    textAlign: 'center'
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
          avatar={this.state.avatarUrl}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardActions style={styles.actions}>
          <RaisedButton label="Play" onClick={this.playTrack}/>
        </CardActions>
        <CardText>
          { commentCount ? commentCount + " comments" : '0 comments'}
        </CardText>
        <CardMedia
          expandable={true}>
          {track ? <img src={track.album.images[1].url} alt='album art' title={track.album.name}/> : ''}
        </CardMedia>

        
         
        
      
      </Card>
    )
  }
}

/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/