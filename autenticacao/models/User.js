const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    nome : {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    tipo: {type: String, required: true},
    course: String,
    dataDeCriacao: {type: String, required: true},
    avatar: String
})

module.exports = mongoose.model('users', userSchema)