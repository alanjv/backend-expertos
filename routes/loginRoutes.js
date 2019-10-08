var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// validador de token
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// Autenticacion con goole

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDb) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticacion normal',

                });
            } else {
                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    token: token,
                    id: usuarioDb._id
                });
            }
        } else {
            //El usuario no existe
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'F';

            usuario.save((err, usuarioDb) => {
                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    token: token,
                    id: usuarioDb._id
                });
            });
        }
    });


    return res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente',
        googleUser: googleUser
    })

});







// Autenticacion normal
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDb) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //crear token
        usuarioDb.password = "F";
        var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            usuario: usuarioDb,
            token: token,
            id: usuarioDb._id
        });
    });


});

module.exports = app;