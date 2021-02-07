var User = require('../models/User')

module.exports.listar = () => {
    return User.find().exec()
}

module.exports.consultar = email => {
    return User.findOne({email: email},{_id:0}).exec()
}

module.exports.registar = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.remover = u_email => {
    return User.deleteOne({email: u_email})
}

module.exports.update = (u_email, campos) => {
    return User
        .updateOne({email:u_email},campos)
        .exec()
}