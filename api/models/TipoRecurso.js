var mongoose = require('mongoose')

var tiporecursoSchema = new mongoose.Schema({
    "tipo" : {type: String, required: true}
});

module.exports = mongoose.model('tiporecursos', tiporecursoSchema)