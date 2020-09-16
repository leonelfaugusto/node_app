"use strict";

const contacto = (mongoose) => {
    const ContactosSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        telefone: {
            type: Number,
            required: true,
            min: 100000000,
            max: 999999999,
        },
    }, { timestamps: true });

    const Contacto = mongoose.model(
        'contacto',
        ContactosSchema,
    );
    return Contacto;
}

module.exports = contacto;