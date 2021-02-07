var mongoose = require('mongoose')

var notificacaoSchema = new mongoose.Schema({
    "tipo" : {type: String, required: true},
    "dataDeCriacao": {type: String, required: true},
    "remetente": {type: String, required: true},
    "destinatario": {type: String, required: true},
    "descricao" : {type: String, required: true}
});

module.exports = mongoose.model('notificacoes', notificacaoSchema)

