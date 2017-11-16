import React from 'react'

export default class Avatar extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      userId: props.userId,
      access_token: props.access_token,
      url: null,
      key: props.key || ''
    }    
  }

  componentWillReceiveProps(nextProps) {
    console.log('receiving props')
    this.setState({userId: nextProps.userId});
    this.getUrl()
  }

  getUrl(){
    const {userId, access_token} = this.state
    const url = 'https://api.spotify.com/v1/users/' + userId
    fetch(url, {
      headers: {
          'Authorization': 'Bearer ' + access_token
        }
    })
    .then(res=>res.json())
    .then(res=> {
      const images = res.images || []
      if(images.length){
        let imgUrl = res.images[0].url
        this.setState({url: imgUrl})
      }
    })
  }

  render() {
    return <img src={this.state.url} key={this.state.key} className='avatar' alt={this.state.userId}/>
  }
}
