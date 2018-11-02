var mongoose = require('mongoose');

var schemaLibro = new mongoose.Schema({
    // Del Libro
    titulo: String,
    subtitulo: String,
    anioPublicacion: Number,
    pais: String,
    ciudad: String,
    editorial: {type: String, default: 'Indie'},
    img: String,

    // Datos libreria
    descripcion: String,
    stock: {type: Number, default: 1 },
    creado: { type: Date, default: Date.now },
    nuevo: { type: Boolean, default: false},
    categoria: { type: String, default: 'No definida'},
    temas: Array,
    keywords: { type: Array, default: ['Historia','Humanidades']},
    precio: { type: Number, default: 10000 },
    precioOferta: { type: Number, default: 9000 },
    oferta: { type: Boolean, default: false },
    destacado: { type: Boolean, default: false },

    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    authors : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        default: 'ObjectId("5b85db2c6158713643a2e3db")'
    }],
    resenias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resena'
    }]
});



module.exports = mongoose.model('Libro', schemaLibro);