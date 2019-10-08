var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Categoria = require('../models/categoria');

// Obtenet todos las categorias
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria.find({}, 'nombreCategoria usuario')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categoria',
                        errors: err
                    });
                }

                Categoria.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });
                });
            });

});




// Modificar categoria
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el' + id + 'no existe',
                errors: { messaje: 'No existe una categoria con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });

    });

});


// Agregar nueva categoria

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var categoria = new Categoria({
        nombreCategoria: body.nombreCategoria,
        usuario: req.usuario._id

    });

    categoria.save((err, categoriaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la categoria',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            categoria: categoriaGuardada,
            usuariotoken: req.usuario
        });
    });


});

// Eliminar categoria

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoria',
                errors: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe categoria con ese id',
                errors: { message: 'No existe categoria con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaBorrada
        });
    });

});

module.exports = app;