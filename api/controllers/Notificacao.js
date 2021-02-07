// Notificacao controller

var Notificacao = require('../models/Notificacao')

// Returns Notificacoes
module.exports.getNotificacoes = () => {
    return Notificacao
        .find()
        .sort({dataDeCriacao: -1})
        .exec()
}

// Returns Notificacoes By Addressee
module.exports.getNotificacoesByAddressee = (addressee) => {
    return Notificacao
        .find({destinatario: addressee})
        .sort({dataDeCriacao: -1})
        .exec()
}

// Inserts Notificacao
module.exports.insert = (notf) => {
    let new_notf = new Notificacao(notf)
    return new_notf.save()
}

// Deletes Notificacao
module.exports.delete = (id_notf) => {
    return Notificacao
        .remove({_id: id_notf})
        .exec()
}