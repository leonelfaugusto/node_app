"use strict"; 

const ContactsController = require('./ContactsController');
const UserController = require('./UserController');
const AuthController = require('./AuthController');

module.exports.init = (app, models) => {
    new ContactsController().init(app, models);
    new UserController().init(app, models);
    new AuthController().init(app, models);
}