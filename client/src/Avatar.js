import React from 'react'
import Api from './Api.js'
// import MAvatar from 'material-ui/Avatar'
const api = new Api()

export default class Avatar extends React.Component {
  constructor(props){
    super(props)
    // this.theAvatar = this.theAvatar.bind(this)
    this.state = {
      userId: props.userId,
      access_token: props.access_token,
      url: null,
      theKey: props.theKey || ''
    }    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({userId: nextProps.userId});
    this.getUrl()
  }

  getUrl(){
    const {userId, access_token} = this.state
    api.getAvatarUrl(userId, access_token)
    .then(res=>res.json())
    .then(res=> {
      const images = res.images || []
      if(images.length){
        let imgUrl = res.images[0].url
        this.setState({url: imgUrl})
      }
    })
  }

  // theAvatar(){
  //   if (this.state.url == null){
  //     return <MAvatar size='64'>{this.state.userId}</MAvatar>
  //   } else {
  //     <img src={this.state.url} key={this.state.theKey} className='avatar' alt={this.state.userId}/>
  //   }
  // }

  render() {
    return <img src={this.state.url} key={this.state.theKey} className='avatar' alt={this.state.userId}/>
  }
}
