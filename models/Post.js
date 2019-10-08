var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
    titulo: { type: String, required: [true, 'El	titulo	es	necesario'] },
    img: { type: String, required: false },
    contenido: { type: String, required: [true, 'El	contenido	es	necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    autor: { type: String, required: [true, 'El	autor	es	necesario'] },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: [true, 'El	id	categoria	es	un	campo	obligatorio'] },
    tipo: { type: String, required: [true, 'El tipo	es	necesario'] }
});
module.exports = mongoose.model('Post', postSchema);