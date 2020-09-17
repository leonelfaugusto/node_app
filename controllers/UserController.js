"use strict";

const { isAdmin } = require('../lib/auth')

class UserController {

    init(app, models) {
        app.get("/users", isAdmin, (req, res) => this.index.call(this, req, res, models));
        app.get("/users/:id", isAdmin, (req, res) => this.user.call(this, req, res, models));
        app.post("/users", isAdmin, (req, res) => this.insert.call(this, req, res, models));
        app.put("/users/:id", isAdmin, (req, res) => this.edit.call(this, req, res, models));
        app.put("/users/:id/contact", isAdmin, (req, res) => this.insertContact.call(this, req, res, models));
        app.delete("/users/:id", isAdmin, (req, res) => this.delete.call(this, req, res, models));
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
            const user = await User.findById(id).populate('contacts');
            if (user) {
                Object.entries(to_edit).forEach(([key, value]) => {
                    if(key != 'role') {
                        user[key] = value;
                    }
                });
                await user.save();
                res.status(200).json(user);
            } else {
                res.status(400).json({
                    error: 'User not found.',
                })
            }
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