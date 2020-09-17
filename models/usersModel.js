"use strict";

const bcrypt = require('bcrypt');
const validator = require('validator');

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
            role: {
                type: String,
                required: true,
                enum: ['ADMIN', 'USER'],
                default: 'USER',
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

    UserSchema.path('email').validate(function (email) {
        return validator.isEmail(email);
     }, 'Wrong email format');

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