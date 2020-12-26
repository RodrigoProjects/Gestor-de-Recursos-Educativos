// User controller

var User = require('../models/user')

// Returns User list
module.exports.list = () => {
    return User
        .find()
        .sort({email:1})
        .exec()
}

module.exports.lookUp = (id) => {
    return User
        .findOne({_id:id})
        .exec()
}

module.exports.lookUpEmail = (email) => {
    return User
        .findOne({email: email})
        .exec()
}

module.exports.insert = user => {
    var newUser = new User(user)
    return newUser.save()
}