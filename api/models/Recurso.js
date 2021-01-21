var mongoose = require('mongoose')

var recursoSchema = new mongoose.Schema({
    "titulo": {type: String, required: true},
    "dataDeCriacao": {type: String, required: true},
    "ficheiros": {type: [String], required: true},
    "autor": {type: String, required: true},
    "classificacao": {type: Number, default: 0},
    "imagem": String,
    "acesso": {type: String, required: true},
    "estado": {type: String, default: 'Ativo'},
    "comentarios": [{_id: mongoose.Types.ObjectId,autor: String, dataDeCriacao: String, conteudo: String, comentarios: [{_id: mongoose.Types.ObjectId,autor: String, dataDeCriacao: String, conteudo: String}]}]
});

module.exports = mongoose.model('recursos', recursoSchema)