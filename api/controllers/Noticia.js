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
    Recurso.find({recurso_id: p.recurso_id}, function (err, res) {
        if (err) { return {} }
        if (!res) {
            let new_pedido = new Pedido(p)
            return new_pedido.save()
        }
    })
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