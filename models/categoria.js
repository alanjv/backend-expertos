var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombreCategoria: { type: String, required: [true, 'La categoria es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'categorias' });
module.exports = mongoose.model('Categorias', categoriaSchema);