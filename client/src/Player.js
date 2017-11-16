import React from 'react'

export default class Player extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      track: props.track
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({track: nextProps.track});
  }

  render(){
    return (
      <div className="player">
        <iframe title='myPlayer' height="80" width="300" src={"https://open.spotify.com/embed?uri=spotify:track:" + this.state.track + "&view=coverart"} frameBorder="0" allowtransparency="true"></iframe>
      </div>
    )
  }
}