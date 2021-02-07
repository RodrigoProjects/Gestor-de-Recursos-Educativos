// Recurso controller

var Recurso = require('../models/Recurso')

// Returns Recursos
module.exports.getRecursos = () => {
    return Recurso
        .find()
        .sort({dataDeCriacao: -1})
        .exec()
}

// Returns Recurso by Id
module.exports.getRecursoById = (idd) => {
    return Recurso
        .findOne({_id: idd})
        .exec()
}

// Returns Public Recursos
module.exports.getPublicRecursos = () => {
    return Recurso
        .find({acesso: 'Público', estado:"Confirmado"})
        .sort({dataDeCriacao: -1})
        .exec()
}

// Returns Recursos by Author
module.exports.getRecursosByAuthor = (email) => {
    return Recurso
        .find({autor: email})
        .sort({dataDeCriacao: -1})
        .exec()
}

// Inserts Recurso
module.exports.insert = (r) => {
    let new_recurso = new Recurso(r)
    return new_recurso.save()
}

// Updates Recurso
module.exports.update = (id_recurso, campos) => {
    return Recurso
        .updateOne({_id:id_recurso},campos)
        .exec()
}

// Updates comment
module.exports.updateComment = (id_recurso, comentario) => {
    return Recurso
        .updateOne({_id:id_recurso},{ $push: {comentarios: comentario}})
        .exec()
}

// Pushes subcomment
module.exports.pushSubComment = (id_recurso,id_comentario, comentario) => {
    return Recurso
        .updateOne({_id:id_recurso, "comentarios._id": id_comentario},{ $push: {"comentarios.$.comentarios": comentario}})
        .exec()
}

// Deletes Recurso
module.exports.delete = (id_recurso) => {
    return Recurso
        .remove({_id:id_recurso})
        .exec()
}

// Pushes Classificador
module.exports.pushClassificador = (id_recurso, classificador) => {
    return Recurso
        .updateOne({_id:id_recurso},{ $push: {classificadores: classificador}})
        .exec()
}

// Updates Classificador
module.exports.updateClassificador = (id_recurso, email, classificacao) => {
    return Recurso
        .updateOne({_id:id_recurso, "classificadores.user": email},{ $set: {"classificadores.$.classificacao": classificacao}})
        .exec()
}
