var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors')

//Inicializar variables
var app = express();
app.use(cors());

//Cors
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin: *');
    res.header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    res.header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    next();
});

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
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