var mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
    "titulo": {type: String,required: true},
    "conteudo": {type: String, required: true},
    "imagem": String,
    "dataDeCriacao": {type: String, required: true},
    "autor": {type: String, required: true},
    "href": String
});

module.exports = mongoose.model('noticias', noticiaSchema)