"use strict";

require('dotenv').config();

let express = require("express");
let mongoose = require('mongoose');
var bodyParser = require('body-parser')
let controllers = require('./controllers');

let app = express();

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

// Verificação da conexão.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('connected'));

controllers.init(app, mongoose);

app.listen(process.env.HTTP_PORT);