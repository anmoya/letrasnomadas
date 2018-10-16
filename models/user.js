const mongoose = require('mongoose');
// importamos el passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');

// creamos esquema del usuario
let UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    userRol: String,
    personName : String,
    personLastName : String,
    personUrl : String,
    personDesc : String,
    createdAt : { type: Date, default: Date.now },
    updatedAt : { type: Date, default: Date.now }
});

// Inserta metodos al esquema que se utilizaran para la autenticacion
UserSchema.plugin(passportLocalMongoose);

// Exportamos
module.exports = mongoose.model('User', UserSchema);