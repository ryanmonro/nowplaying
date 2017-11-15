import React from 'react'

export default class Player extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      track: props.track
    }
  }

  render(){
    return (
      <div className="player">
        <iframe height="80" width="300" src={"https://open.spotify.com/embed?uri=spotify:track:" + this.state.track + "&view=coverart"} frameBorder="0" allowtransparency="true"></iframe>
      </div>
    )
  }
}