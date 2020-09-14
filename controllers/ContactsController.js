"use strict";

class ContactsController {

    init(app, models) {
        app.get("/contacts", (req, res) => this.index.call(this, req, res, models));
        app.get("/contacts/:id", (req, res) => this.contact.call(this, req, res, models));
        app.post("/contacts", (req, res) => this.insert.call(this, req, res, models));
        app.put("/contacts/:id", (req, res) => this.edit.call(this, req, res, models));
        app.delete("/contacts/:id", (req, res) => this.delete.call(this, req, res, models));
    }

    async index(req, res, { Contacto }) {
        const contactos = await Contacto.find({});
        res.send(contactos);
    }

    async insert(req, res, { Contacto }) {
        const { name, telefone } = req.body;
        const novo = new Contacto({
            name: name,
            telefone: telefone,
        });
        try {
            await novo.save();
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