var User = require('../models/User')

module.exports.listar = () => {
    return User.find().exec()
}

module.exports.consultar = email => {
    return User.findOne({email: email}).exec()
}

module.exports.registar = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = id => {
    return User.deleteOne({_id: id})
}