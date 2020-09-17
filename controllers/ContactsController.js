"use strict";

const { isAuthenticated } = require('../lib/auth');

class ContactsController {

    init(app, models) {
        app.get("/contacts", isAuthenticated, (req, res) => this.index.call(this, req, res, models));
        app.get("/contacts/:id", isAuthenticated, (req, res) => this.contact.call(this, req, res, models));
        app.post("/contacts", isAuthenticated, (req, res) => this.insert.call(this, req, res, models));
        app.put("/contacts/:id", isAuthenticated, (req, res) => this.edit.call(this, req, res, models));
        app.delete("/contacts/:id", isAuthenticated, (req, res) => this.delete.call(this, req, res, models));
    }

    async index(req, res, { User }) {
        try {
            const user = await User.findById(req.me._id, 'contacts').populate('contacts');
            res.status(200).json(user.contacts);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    async insert(req, res, { Contacto, User }) {
        const { name, telefone } = req.body;
        const newContact = new Contacto({
            name: name,
            telefone: telefone,
        });
        try {
            const user = await User.findById(req.me._id);
            if (user) {
                await newContact.save();
                user.contacts.push(newContact._id);
                await user.save();
                res.status(201).json(newContact);
            } else {
                res.status(400).json({
                    error: 'User Not Found',
                });
            }
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

    async edit(req, res, { Contacto, User }) {
        const id = req.params.id;
        const to_edit = req.body;
        try {
            const userContacts = await User.findById(req.me._id);
            const itsMine = userContacts.contacts.findIndex((value) => {
                return value == id;
            });
            if (itsMine >= 0) {
                const contacto = await Contacto.findByIdAndUpdate(id, to_edit, { new: true });
                if(contacto) {
                    res.status(200).json(contacto);
                } else {
                    res.status(400).json({error: 'No contact found'});
                }
            } else {
                res.status(400).send({
                    error: 'No Permission to update this contact'
                });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }

    async delete(req, res, { Contacto, User }) {
        const id = req.params.id;
        try {
            const userContacts = await User.findById(req.me._id);
            const itsMine = userContacts.contacts.findIndex((value) => {
                return value == id;
            });
            if (itsMine >= 0) {
                const contacto = await Contacto.deleteOne({ _id: id });
                if(contacto.deletedCount > 0) {
                    res.status(200).json(contacto);
                } else {
                    res.status(400).json({error: 'No contact found'});
                }
            } else {
                res.status(400).send({
                    error: 'No Permission to delete this contact'
                });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

module.exports = ContactsController;