"use strict";

const contacto = require('./contactosModel');
const user = require('./usersModel');

module.exports = (mongoose) => {
    return {
        Contacto: contacto(mongoose),
        User: user(mongoose),
    }
}