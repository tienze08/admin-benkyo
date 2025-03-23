const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    deckName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Deck', deckSchema);
