"use strict";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getMe = (req, res, next) => {
    const token = req.headers['x-token'];

    if (token == null) {
        return res.status(401).json({
            error: 'Unauthorized',
        });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).json(err);
        }

        req.me = user;
        next();
    })
}

const isAuthenticated = [
    getMe,
    (req, res, next) => {
        if (req.me) {
            next();
        } else {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
    }
];

const isAdmin = [
    getMe,
    (req, res, next) => {
        if (req.me && req.me.email == 'leonelfaugusto@gmail.com') {
            next();
        } else {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
    }
];

const createToken = async (user) => {
    const { _id, email } = user;
    return await jwt.sign({_id, email}, process.env.SECRET, { expiresIn: '30m' });
}

const comparePassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

module.exports = {
    isAuthenticated,
    isAdmin,
    createToken,
    comparePassword,
}