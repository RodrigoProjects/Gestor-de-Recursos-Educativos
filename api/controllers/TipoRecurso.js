// TipoRecurso controller

var TipoRecurso = require('../models/TipoRecurso')

// Returns TipoRecursos
module.exports.getTipoRecursos = () => {
    return TipoRecurso
        .find()
        .exec()
}

// Inserts TipoRecurso
module.exports.insert = (tr) => {
    let new_riporecurso = new TipoRecurso(tr)
    return new_riporecurso.save()
}

// Deletes TipoRecursos
module.exports.delete = (id_tipoRecurso) => {
    return TipoRecursos
        .remove({_id:id_tipoRecurso})
        .exec()
}