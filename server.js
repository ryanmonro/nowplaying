var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var routes = require('./modules/routes')

const PORT = process.env.PORT || 3001;

app.use(cookieParser());

// static routes for React app
app.use(express.static('client/build/'));

// Spotify authorization
app.get('/login', routes.spotify.login)

app.get('/callback', routes.spotify.callback);

app.get('/refresh_token', routes.spotify.refresh_token);

// API Routes
app.get('/api/share', routes.api.createShare)

app.get('/api/comment', routes.api.createComment)

app.get('/api/posts', routes.api.getPosts)

app.get('/api/comments', routes.api.getComments)

app.listen(PORT);