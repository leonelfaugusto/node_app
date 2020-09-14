"use strict"; 

const ContactsController = require('./ContactsController');
const UserController = require('./UserController');

module.exports.init = (app, models) => {
    new ContactsController().init(app, models);
    new UserController().init(app, models);
}