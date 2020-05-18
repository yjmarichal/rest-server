const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore')


const Usuario = require('../models/usuario');



const app = express()


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;

    desde = Number(desde);

    let limite = req.query.limite || 5;

    limite = Number(limite);

    let condicion = { estado: true };
    Usuario.find(condicion, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    err
                });
            Usuario.countDocuments(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario,
                    conteo
                })
            })


        })


    //res.json('Get Usuario')
})

app.post('/usuario', function(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


})

//el put es basicamente una actualizacion de un registro
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;

    //la opcion de _.pick() es para eliminarle algunos atributos a un objeto y devolver el objeto sin esos campos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //esto es para eliminar los parametros enviados que no 
    //deseamos que sean modificados de forma manual
    //delete body.google;
    //delete body.password;
    //delete body.email;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        // if (!usuarioDB) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: {
        //             'message': "Usuario no encontrado"
        //         }
        //     });
        // }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})


app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { 'estado': false }, { new: true }, (err, usuarioDB) => {

        if (err)
            return res.status(400).json({
                ok: false,
                err
            });

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    'message': "Usuario no encontrado"
                }
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })

    })






    ///esta forma elimina el registro de la base de datos pero en la actulidad casi nunca se elimina sino que se le cmbia el estado a false
    // Usuario.findByIdAndRemove(id, (err, usuarioRemove) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!usuarioRemove) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 'message': "Usuario no encontrado"
    //             }
    //         });

    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioRemove
    //     })
    // })

});

module.exports = app;