"use strict";

const { isAuthenticated, isAdmin } = require("../lib/auth");

class ContactsController {

    init(app, models) {
        app.get("/contacts", isAuthenticated, (req, res) => this.index.call(this, req, res, models));
        app.get("/contacts/:id", isAuthenticated, (req, res) => this.contact.call(this, req, res, models));
        app.post("/contacts", isAuthenticated, (req, res) => this.insert.call(this, req, res, models));
        app.put("/contacts/:id", isAuthenticated, (req, res) => this.edit.call(this, req, res, models));
        app.delete("/contacts/:id", isAuthenticated, (req, res) => this.delete.call(this, req, res, models));
    }

    async index(req, res, { Contacto, User }) {
        const user = await User.findOne({ email: req.me.email }, 'contacts').populate('contacts');
        res.send(user.contacts);
    }

    async insert(req, res, { Contacto, User }) {
        const { name, telefone } = req.body;
        const user = await User.findOne({ email: req.me.email });
        const novo = new Contacto({
            name: name,
            telefone: telefone,
        });
        try {
            if (user) {
                await novo.save();
                user.contacts.push(novo._id);
                await user.save();
            } else {
                res.status(400).json({
                    error: 'Not Found',
                });
            }
            res.set("Content-Type", "application/json");
            res.status(200).send(novo);
        } catch (error) {
            res.status(400).json(error);
        }

    }

    async contact(req, res, { Contacto }) {
        const id = req.params.id;
        try {
            const contacto = await Contacto.findById(id);
            if (contacto) {
                res.json(contacto);
            } else {
                res.json({
                    error: 'Not Found',
                });
            }
        } catch (error) {
            res.send(error);
        }
    }

    async edit(req, res, { Contacto }) {
        const id = req.params.id;
        const to_edit = req.body;
        try {
            const contacto = await Contacto.findByIdAndUpdate(id, to_edit, { new: true });
            res.json(contacto);
        } catch (error) {
            res.send(error);
        }
    }

    async delete(req, res, { Contacto }) {
        const id = req.params.id;
        try {
            const contacto = await Contacto.deleteOne({ _id: id });
            res.json(contacto);
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = ContactsController;