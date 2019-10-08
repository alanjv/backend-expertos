var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//conexion Base de datos
mongoose.connection.openUri('mongodb://localhost:27017/quickly', (err, res) => {
    if (err) throw err;
    console.log('Base conectada ');
});

//Importar Rutas
var appRoutes = require('./routes/rutas');
var loginRoutes = require('./routes/loginRoutes');
var usuarioRoutes = require('./routes/usuarioRoutes');
var categoriasRoutes = require('./routes/categoriaRoutes');
var postRoutes = require('./routes/postRoutes');
var busquedaRoutes = require('./routes/busquedaRoutes');
var uploadRoutes = require('./routes/uploadRoutes');
var imagenesRoutes = require('./routes/imagenesRoutes');
//server index config
var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/upload', serveIndex(__dirname + '/upload'));

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/posts', postRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);

//Puerto
app.listen(3001, () => {
    console.log('Server en puerto 3001 ');
});