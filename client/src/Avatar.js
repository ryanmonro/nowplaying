import React from 'react'
import Api from './Api.js'
const api = new Api()

const styles = {
  avatar: {
    height: 40,
    width: 40,
    borderRadius: '50%'
  }
}

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

  componentWillMount(){
    this.getUrl()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.state.userId) {
      this.setState({userId: nextProps.userId});
      this.getUrl()
    }
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
    return <img src={this.state.url} key={this.state.theKey} style={styles.avatar} title={this.state.userId} alt='avatar'/>
  }
}
