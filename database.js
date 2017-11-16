(()=>{

  const pgp = require('pg-promise')();
  
  const connection = process.env.DATABASE_URL || {
    host: 'localhost',
    port: 5432,
    database: 'nowplaying_dev'
  }

  const db = pgp(connection);

  function getPosts(){
    return db.any('SELECT users.name AS name, tracks.spotify_id AS track, shares.id AS share_id, shares.created_at AS timestamp FROM shares, tracks, users, comments WHERE shares.track_id = tracks.id AND shares.user_id = users.id ORDER BY timestamp DESC')
  }

  function getInsertUserId(name) {
    return db.task('getInsertUserId', t => {
      return t.oneOrNone('SELECT id FROM users WHERE name = $1', [name], u => u && u.id)
        .then(userId => {
          return userId || t.one('INSERT INTO Users(name, created_at, updated_at) VALUES($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [name], u => u.id);
        });
    });
  }

  function getInsertTrackId(spotify_id) {
    return db.task('getInsertTrackId', t => {
      return t.oneOrNone('SELECT id FROM tracks WHERE spotify_id = $1', [spotify_id], u => u && u.id)
        .then(trackId => {
          return trackId || t.one('INSERT INTO tracks(spotify_id,  created_at, updated_at) VALUES($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [spotify_id], u => u.id);
        });
    });
  }

  function createShare(userId, trackId){
    return db.none('INSERT INTO shares(user_id, track_id, created_at, updated_at) VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)', [userId, trackId])
  }


  module.exports = {
    getInsertTrackId: getInsertTrackId,
    getInsertUserId: getInsertUserId,
    getPosts: getPosts,
    createShare: createShare
  }

})()