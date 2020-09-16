"use strict";

const bcrypt = require('bcrypt');

const user = (mongoose) => {
    const UserSchema = new mongoose.Schema(
        {
            email: {
                type: String,
                required: true,
                unique: true,
            },
            password: {
                type: String,
                required: true,
            },
            contacts: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'contacto',
            }],
        },
        {
            timestamps: true,
        }
    );

    UserSchema.pre('save', function(next) {
        var user = this;

        if(!user.isModified('password')) {
            return next();
        }

        bcrypt.genSalt(10, function(err, salt)  {
            if(err) {
                return next(err);
            }

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    return next(err);
                }

                user.password = hash;
                next();
            });
        });
    });

    const User = mongoose.model(
        'user',
        UserSchema,
    );
    return User;
}

module.exports = user;