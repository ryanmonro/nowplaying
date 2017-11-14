var express = require('express');
var app = express();
var ChanceLib = require('chance');
var chance = new ChanceLib();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const pgp = require('pg-promise')();

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'nowplaying_dev'
}

const db = pgp(connection);

const PORT = 8888;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cookieParser());



app.listen(PORT);