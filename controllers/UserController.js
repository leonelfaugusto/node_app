"use strict";

const { createToken, comparePassword, isAuthenticated, isAdmin } = require('../lib/auth');

class UserController {

    init(app, models) {
        app.get("/users", isAdmin, (req, res) => this.index.call(this, req, res, models));
        app.get("/me", isAuthenticated, (req, res) => this.me.call(this, req, res, models));
        app.put("/me", isAuthenticated, (req, res) => this.edit.call(this, req, res, models));
        app.delete("/me", isAuthenticated, (req, res) => this.delete.call(this, req, res, models));

        // Sigin
        app.post('/signin', (req, res) => this.signIn.call(this, req, res, models));
        app.post('/register', (req, res) => this.register.call(this, req, res, models));
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
                res.status(400).json({ error: 'Invalid Password' });
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

    async index(req, res, { User }) {
        const users = await User.find({}).populate('contacts');
        res.send(users);
    }

    async me(req, res, { User }) {
        try {
            const user = await User.findById(req.me._id).populate('contacts');
            if (user) {
                res.json(user);
            } else {
                res.json({
                    error: 'Not Found',
                });
            }
        } catch (error) {
            res.send(error);
        }
    }

    async edit(req, res, { User }) {
        const id = req.me._id;
        const to_edit = req.body;
        try {
            const user = await User.findById(id).populate('contacts');
            Object.entries(to_edit).forEach(([key, value]) => {
                user[key] = value;
            });
            await user.save();
            res.json(user);
        } catch (error) {
            res.send(error);
        }
    }

    async delete(req, res, { User }) {
        const id = req.me._id;
        try {
            const user = await User.deleteOne({ _id: id });
            res.json(user);
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = UserController;