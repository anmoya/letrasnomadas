const mongoose = require('mongoose');
// importamos el passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');

// creamos esquema del usuario
let UserSchema = new mongoose.Schema({
    userName: String,
    password: String
});

// Inserta metodos al esquema que se utilizaran para la autenticacion
UserSchema.plugin(passportLocalMongoose);

// Exportamos
module.exports = mongoose.model('User', UserSchema);