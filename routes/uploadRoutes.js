var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario');
var Post = require('../models/post');


app.use(fileUpload({
    createParentPath: true
}));

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;


    var tiposVaidos = ['post', 'archivos', 'videos', 'usuario'];

    if (tiposVaidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'No es una coleccion valida' }

        });
    }


    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }


    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // extensiones permitidas

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son' + extensionesValidas.join(', ') }

        });
    }

    // nombre personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal  a un path
    var path = (__dirname + `/uploads/${tipo}/${nombreArchivo}`);
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
    });
    subirPorTipo(tipo, id, nombreArchivo, res);

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Archivo movido',
    //     extensionArchivo: extensionArchivo,
    //     nombreCortado: nombreCortado,

    // });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuario') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = (__dirname + '/uploads/usuario/' + usuario.img);

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }


            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = 'F';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado

                });
            });

        });
    }

    if (tipo === 'post') {
        Post.findById(id, (err, post) => {
            if (!post) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Post no existe',
                    errors: { message: 'Post no existe' }
                });
            }

            var pathViejo = (__dirname + '/uploads/post/' + post.img);

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }


            post.img = nombreArchivo;

            post.save((err, postActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de post actualizada',
                    post: postActualizado

                });
            });

        });
    }


    if (tipo === 'archivos') {

    }
}


module.exports = app;