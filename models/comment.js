var mongoose = require('mongoose');

var schemaComment = new mongoose.Schema({
    text: String,
    user: String
});

module.exports = mongoose.model('Comment', schemaComment);