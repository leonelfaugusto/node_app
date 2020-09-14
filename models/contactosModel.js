"use strict";

const contacto = (mongoose) => {
    const Contacto = mongoose.model(
        'contacto',
        new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            telefone: {
                type: Number,
                required: true
            },
        })
    );
    return Contacto;
}

module.exports = contacto;