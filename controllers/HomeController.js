"use strict";

class HomeController {

    init(app, models) {
        app.get("/", (req, res) => this.index.call(this, req, res, models));
        app.get("/contacto/:id", (req, res) => this.contacto.call(this, req, res, models));
        app.post("/contacto", (req, res) => this.insert.call(this, req, res, models));
    }

    async index(req, res, {Contacto}) {
        const contactos = await Contacto.find({});
        res.render(
            'index',
            {
                contactos: contactos,
                titulo: "Lista de contactos"
            }
        );
    }

    async insert(req, res, {Contacto}) {
        let body = req.body;
        console.log(body)
        let novo = new Contacto({name: body.name});
        await novo.save();
        res.send(novo);
    }

    async contacto(req, res, {Contacto}) {
        var id = req.params.id;
        let contacto = await Contacto.findById(id);
        res.render(
            'contacto',
            {
                contacto: contacto,
                titulo: "Contacto"
            }
        );
    }
}

module.exports = HomeController;