const mongoose = require('mongoose');

const utilitiesSchema = new mongoose.Schema({
    type: String,
    title: String,
    text: String, 
    Subtype: String,
    order: Number
});

module.exports = mongoose.model('Utilities', utilitiesSchema);
