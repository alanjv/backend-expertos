var expres = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Inicializar variables
var app = expres();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//conexion Base de datos
mongoose.connection.openUri('mongodb://localhost:27017/quickly', (err, res) => {
    if (err) throw err;
    console.log('Base conectada ');
});

//Importar Rutas
var appRoutes = require('./routes/rutas');
var loginRoutes = require('./routes/login');
var usuarioRoutes = require('./routes/usuario');

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//Puerto
app.listen(3001, () => {
    console.log('Server en puerto 3001 ');
});