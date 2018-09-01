var mongoose = require('mongoose');

var schemaAuthor = new mongoose.Schema({
    authorName      : String,
    authorLastName  : String,
    authorBornDate  : { type: Date, default: Date.now },
    authorCountry   : String,
    authorCity      : String,
    authorBio       : String
});

module.exports = mongoose.model('Author', schemaAuthor);