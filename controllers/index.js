"use strict"; 

let HomeController = require('./HomeController');
let dadosIniciais = require('../data/contactos');
let models = require('../models');

module.exports.init = (app, mongoose) => {
    new HomeController(dadosIniciais.contactos).init(app, models(mongoose));
}