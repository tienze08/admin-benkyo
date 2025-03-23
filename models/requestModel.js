const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'reject'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);