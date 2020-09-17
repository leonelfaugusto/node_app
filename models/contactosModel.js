"use strict";

const validator = require('validator');

const contacto = (mongoose) => {
    const ContactsSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: true
            },
            telefone: {
                type: Number,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

    ContactsSchema.path('telefone').validate(function (telefone) {
        return validator.isMobilePhone(telefone + '', 'pt-PT');
     }, 'Wrong telefone format');

    const Contacto = mongoose.model(
        'contacto',
        ContactsSchema,
    );
    return Contacto;
}

module.exports = contacto;