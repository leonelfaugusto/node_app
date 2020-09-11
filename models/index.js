"use strict";

const contacto = require('./contactosModel');

module.exports = (mongoose) => {
    return {
        Contacto: contacto(mongoose),
    }
}