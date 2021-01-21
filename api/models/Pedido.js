var mongoose = require('mongoose')

var pedidoSchema = new mongoose.Schema({
    "recurso_id": {type: mongoose.Types.ObjectId,required: true},
    "estado": {type: String, required: true},
    "comentario": String,
    "dataDeCriacao": {type: String, required: true}
});

module.exports = mongoose.model('pedidos', pedidoSchema)