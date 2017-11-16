var database = require('../modules/database')
var routes = require('../modules/routes')
var assert = require('assert')

describe('api', function() {
  describe('getPosts', function(){
    it('should return > 0 results', function(done){
      database.getPosts()
      .then(function(data) {
        assert(data.length > 0)
        done()
      })
    })
    it('should return posts with a name', function(done){
      database.getPosts()
      .then(function(data) {
        assert(data[0].name != undefined)
        done()
      })
    })
    it('should return posts with a track', function(done){
      database.getPosts()
      .then(function(data) {
        assert(data[0].track != undefined)
        done()
      })
    })
    it('should return posts with a share_id', function(done){
      database.getPosts()
      .then(function(data) {
        assert(data[0].share_id != undefined)
        done()
      })
    })
  })
  describe('getUser', function() {
    it('should return a user called john', function(done){
      database.getUserByName('john')
      .then(function(data) {
        assert(data[0].name != undefined)
        done()
      })
    })
  })
})