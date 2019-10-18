var express = require('express');
var app = express();

var Categoria = require('../models/categoria');
var Post = require('../models/post');
var Usuario = require('../models/usuario');

// bysqueda po coleccion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuario(busqueda, regex);
            break;
        case 'posts':
            promesa = buscarPost(busqueda, regex);
            break;

        case 'categorias':
            promesa = buscarCategoria(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios posts y categorias',
                error: { message: ' Tipo de tabla/coleccion no valido' }
            });


    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data

        });
    });

});


/// Busqueda general
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarCategoria(busqueda, regex),
            buscarPost(busqueda, regex),
            buscarUsuario(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                categorias: respuestas[0],
                posts: respuestas[1],
                usuarios: respuestas[2]
            });
        });


});

function buscarCategoria(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Categoria.find({ nombreCategoria: regex }, (err, categorias) => {
            if (err) {
                reject('Error al cargar categorias', err);
            } else {
                resolve(categorias);
            }
        });
    });

}

function buscarPost(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Post.find({ titulo: regex }, (err, titulos) => {
            if (err) {
                reject('Error al cargar posts', err);
            } else {
                resolve(titulos);
            }
        });
    });

}

function buscarUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });

}

module.exports = app;