import React from 'react'
import Player from './Player'
import Avatar from './Avatar'

export default class Share extends React.Component {
  constructor(props){
    super(props)

    this.state = props
    
  }

  render(){
    const {key, post, access_token} = this.state
    return (
      <div className="share" key={key}>
        <Avatar userId={post.name} access_token={access_token}/>
        <div className="player">
          <iframe title={key} height="80" width="300" src={"https://open.spotify.com/embed?uri=spotify:track:" + post.track + "&view=coverart"} frameBorder="0" allowtransparency="true"></iframe>
          <form className="commentForm"> 
            <input type="text" name="body" />
            <button className="commentButton">Post</button>
          </form>
        </div>
      </div>
    )
  }
}