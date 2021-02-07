// Pedido controller

var Pedido = require('../models/Pedido')
var Recurso = require('../models/Recurso')

// Returns Pedidos
module.exports.getPedidos = () => {
    return Pedido
        .find()
        .exec()
}

// Inserts Pedido
module.exports.insert = (p) => {
    let new_pedido = new Pedido(p)
    return new_pedido.save()
}

// Updates Pedido
module.exports.update = (id_pedido, campos) => {
    return Pedido
        .updateOne({_id:id_pedido},campos)
        .exec()
}

// Deletes Pedido
module.exports.delete = (id_pedido) => {
    return Pedido
        .remove({_id:id_pedido})
        .exec()
}

// Deletes Pedido by Recurso
module.exports.deleteByRecurso = (id_recurso) => {
    return Pedido
        .remove({recurso_id: id_recurso})
        .exec()
}