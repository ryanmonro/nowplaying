import React from 'react'
// import Player from './Player'
import Avatar from './Avatar'

export default class Share extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      post: props.post,
      key: props.theKey,
      access_token: props.access_token
    }
    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({post: nextProps.post});
  }

  render(){
    let {key, post, access_token} = this.state
    return (
      <div key={key} className="share">
        <Avatar userId={post.name} theKey={key} access_token={access_token}/>
        <div className="player">
          <iframe title={key} height="80" width="300" src={"https://open.spotify.com/embed?uri=spotify:track:" + post.track + "&view=coverart"} frameBorder="0" allowtransparency="true"></iframe>
          
        </div>
      </div>
    )
  }
}

/*<form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>*/

/* <div key={key} className="share">
        <Avatar userId={post.name} access_token={access_token}/>
        <div className="player">
          <iframe title={key} height="80" width="300" src={"https://open.spotify.com/embed?uri=spotify:track:" + post.track + "&view=coverart"} frameBorder="0" allowtransparency="true"></iframe>
          
        </div>
      </div> */

      // {post.name} - {post.track}