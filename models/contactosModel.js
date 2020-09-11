"use strict";

const contacto = (mongoose) => {
    const Contacto = mongoose.model(
        'contacto',
        new mongoose.Schema({
            name: {
                type: String,
                require: true,
            },
            telefone: {
                type: Number,
                require: true,
            },
        })
    );
    return Contacto;
}

module.exports = contacto;