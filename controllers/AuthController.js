"use strict";

const { models } = require('mongoose');
const { createToken, isAuthenticated, comparePassword } = require('../lib/auth');

class AuthController {

    init(app, models) {
        //Sign In
        app.post('/signin', (req, res) => this.signIn.call(this, req, res, models));
        app.post('/register', (req, res) => this.register.call(this, req, res, models));

        //Me
        app.route('/me')
            .get(isAuthenticated, (req, res) => this.me.call(this, req, res, models))
            .put(isAuthenticated, (req, res) => this.edit.call(this, req, res, models))
            .delete(isAuthenticated, (req, res) => this.delete.call(this, req, res, models));
    }

    async signIn(req, res, { User }) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            if (await comparePassword(password, user.password)) {
                res.status(200).json({
                    token: await createToken(user),
                })
            } else {
                res.status(400).json({ error: 'Wrong password' });
            }
        } else {
            res.status(400).json({ error: 'No user found' });
        }
    }

    async register(req, res, { User }) {
        const { email, password } = req.body;
        const novo = new User({
            email: email,
            password: password,
        });
        try {
            await novo.save();
            res.status(200).json({
                token: await createToken(novo),
            });
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async me(req, res, { User }) {
        try {
            const user = await User.findById(req.me._id).populate('contacts');
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(400).json({
                    error: 'User not found.',
                })
            }
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async edit(req, res, { User }) {
        const id = req.me._id;
        const to_edit = req.body;
        try {
            const user = await User.findById(req.me._id).populate('contacts');
            if (user) {
                Object.entries(to_edit).forEach(([key, value]) => {
                    user[key] = value;
                });
                await user.save();
                res.status(200).json(user);
            } else {
                res.status(400).json({
                    error: 'User not found.',
                })
            }
        } catch(err) {
            res.status(400).json(err);
        }
    }

    async delete(req, res, { User }) {
        try {
            const deleted = await User.deleteOne({ _id: req.me._id });
            res.status(200).json(deleted);
        } catch (err) {
            res.status(400).json(err);
        }
    }
}

module.exports = AuthController;