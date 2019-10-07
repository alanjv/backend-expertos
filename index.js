var expres = require('express');
var mongoose = require('mongoose')


//Inicializar variables
var app = expres();

mongoose.connection.openUri('mongodb://localhost:27017/quickly', (err, res) => {
    if (err) throw err;
    console.log('Base conectada ');
});

//Rutas
app.get('/', (req, res, next) => {

})


//Puerto
app.listen(3001, () => {
    console.log('Server en puerto 3001 ');
});