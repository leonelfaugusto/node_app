"use strict";

const bcrypt = require('bcrypt');

const user = (mongoose) => {
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            createIndexes: true,
        },
        password: {
            type: String,
            required: true,
        },
        contacts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contacto',
        }],
    }, { timestamps: true });

    UserSchema.pre('save', function (next) {
        var user = this;

        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password')) return next();

        // generate a salt
        bcrypt.genSalt(parseInt(process.env.ROUNDS), function (err, salt) {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    });

    const User = mongoose.model(
        'user',
        UserSchema
    );


    return User;
}

module.exports = user;