"use strict";

const { createToken, comparePassword } = require('../lib/auth');

class UserController {

    init(app, models) {
        app.get("/users", (req, res) => this.index.call(this, req, res, models));
        app.get("/users/:id", (req, res) => this.user.call(this, req, res, models));
        app.post("/users", (req, res) => this.insert.call(this, req, res, models));
        app.put("/users/:id", (req, res) => this.edit.call(this, req, res, models));
        app.put("/users/:id/contact", (req, res) => this.insertContact.call(this, req, res, models));
        app.delete("/users/:id", (req, res) => this.delete.call(this, req, res, models));

        // Sigin
        app.post('/signin', (req, res) => this.signIn.call(this, req, res, models));
    }

    async signIn(req, res, models) {
        const { email, password } = req.body;
        const user = await models.User.findOne({ email });
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

    async index(req, res, { User }) {
        const users = await User.find({}).populate('contacts');
        res.send(users);
    }

    async insert(req, res, { User }) {
        const { email, password } = req.body;
        const novo = new User({
            email: email,
            password: password,
        });
        try {
            await novo.save();
            res.status(200).json(novo);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async insertContact(req, res, { User }) {
        const id = req.params.id;
        const { idContact } = req.body;
        try {
            const user = await User.findById(id).populate('contacts');
            if (user) {
                user.contacts.push(idContact);
                await user.save();
                res.status(201).json(user);
            } else {
                res.status(400).json({
                    error: 'Not Found',
                });
            }
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async user(req, res, { User }) {
        const id = req.params.id;
        try {
            const user = await User.findById(id).populate('contacts');
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
        const id = req.params.id;
        const to_edit = req.body;
        try {
            const user = await User.findByIdAndUpdate(id, to_edit, { new: true }).populate('contacts');
            res.json(user);
        } catch (error) {
            res.send(error);
        }
    }

    async delete(req, res, { User }) {
        const id = req.params.id;
        try {
            const user = await User.deleteOne({ _id: id });
            res.json(user);
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = UserController;