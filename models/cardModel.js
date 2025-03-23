const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    frontCard: { type: String, required: true, unique: true },
    backCard: { type: String, required: true },
});

module.exports = mongoose.model('Card', cardSchema);