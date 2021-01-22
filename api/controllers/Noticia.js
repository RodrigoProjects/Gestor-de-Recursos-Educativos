// Noticia controller

var Noticia = require('../models/Noticia')

// Returns Noticias
module.exports.getNoticias = () => {
    return Noticia
        .find()
        .exec()
}

// Inserts Noticia
module.exports.insert = (n) => {
    let new_noticia = new Noticia(n)
    return new_noticia.save()
}

// Updates Noticia
module.exports.update = (id_noticia, campos) => {
    return Noticia
        .updateOne({_id:id_noticia},campos)
        .exec()
}

// Deletes Noticia
module.exports.delete = (id_noticia) => {
    return Noticia
        .remove({_id:id_noticia})
        .exec()
}