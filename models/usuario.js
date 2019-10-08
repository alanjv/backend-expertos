var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var esquema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'INVITED_ROLE'],
    message: '{VALUE} no es un rol valido'
};

var usuario = new esquema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contrasña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'INVITED_ROLE', enum: rolesValidos },
});

usuario.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Usuario', usuario);