"use strict";

require('dotenv').config();

let express = require("express");
let mongoose = require('mongoose');
var bodyParser = require('body-parser')
const models = require('./models')(mongoose);
let controllers = require('./controllers');

let app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// Verificação da conexão.
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('connected'));

controllers.init(app, models);

app.listen(process.env.HTTP_PORT);