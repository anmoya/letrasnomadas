const mongoose = require('mongoose');

let schemaResena = new mongoose.Schema({
    nombreAutor: String,
    apellidoAutor: String,
    titulo: String,
    link: String
});

module.exports = mongoose.model('Resena', schemaResena);