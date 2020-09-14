"use strict";

const user = (mongoose) => {
    const User = mongoose.model(
        'user',
        new mongoose.Schema({
            email: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
            contacts: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'contacto',
            }],
        })
    );
    return User;
}

module.exports = user;