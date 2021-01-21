// Pedido controller

var Pedido = require('../models/Pedido')

// Returns Pedidos
module.exports.getPedidos = () => {
    return Pedido
        .find()
        .exec()
}
