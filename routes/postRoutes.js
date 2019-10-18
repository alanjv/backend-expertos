var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();
var Post = require('../models/post');

// Obtenet todos las posts
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Post.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombreCategoria')
        .exec(

            (err, posts) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando post',
                        errors: err
                    });
                }
                Post.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        posts: posts,
                        total: conteo
                    });
                });
            });

});

// obtener post
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Post.findById(id)
        .populate('usuario', 'nombre img email')
        .populate('categorias', 'nombreCategoria')
        .exec((err, post) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar post',
                    errors: err
                });
            }
            if (!post) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El post con el id ' + id + 'no existe ',
                    errors: {
                        message: 'No existe un postcon ese ID '
                    }
                });
            }
            res.status(200).json({
                ok: true,
                post: post
            });
        });
});



// Modificar post
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Post.findById(id, (err, post) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar post',
                errors: err
            });
        }

        if (!post) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La post con el' + id + 'no existe',
                errors: { messaje: 'No existe una post con ese ID' }
            });
        }

        post.titulo = body.titulo;
        post.usuario = req.usuario._id;
        post.contenido = body.contenido;
        post.autor = body.autor;
        post.categoria = body.categoria;
        post.tipo = body.tipo;
        post.comentar = body.comentar;


        post.save((err, postGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar post',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                post: postGuardado
            });
        });

    });

});


// Agregar nueva post

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var post = new Post({
        titulo: body.titulo,
        usuario: req.usuario._id,
        contenido: body.contenido,
        autor: body.autor,
        categoria: body.categoria,
        tipo: body.tipo,
        comentar: body.comentar


    });

    post.save((err, postGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la post',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            post: postGuardada,

        });
    });


});

// Eliminar post

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Post.findByIdAndRemove(id, (err, postBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar post',
                errors: err
            });
        }

        if (!postBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe post con ese id',
                errors: { message: 'No existe post con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            post: postBorrada
        });
    });

});

module.exports = app;