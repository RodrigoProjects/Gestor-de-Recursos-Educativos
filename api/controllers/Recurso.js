// Recurso controller

var Recurso = require('../models/Recurso')

// Returns Recursos
module.exports.getRecursos = () => {
    return Recurso
        .find()
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

// Deletes Recurso
module.exports.delete = (id_recurso) => {
    return Recurso
        .remove({_id:id_recurso})
        .exec()
}