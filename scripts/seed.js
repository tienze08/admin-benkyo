const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const Deck = require('../models/deckModel');
const Card = require('../models/cardModel');
const Request = require('../models/requestModel');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

const seedDatabase = async () => {
    try {
        // Đọc dữ liệu từ file data.json
        const dataPath = path.join(__dirname, '../data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // Xóa dữ liệu cũ
        await User.deleteMany({});
        await Deck.deleteMany({});
        await Card.deleteMany({});
        await Request.deleteMany({});

        // Thêm người dùng (mã hóa mật khẩu)
        const users = await Promise.all(data.users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return {
                username: user.username,
                password: hashedPassword,
                role: user.role
            };
        }));
        await User.insertMany(users);

        // Thêm thẻ (Card) trước để lấy ID
        const insertedCards = await Card.insertMany(data.cards);

        // Tạo một map để dễ tra cứu ID của card
        const cardMap = {};
        insertedCards.forEach(card => {
            cardMap[card.frontCard] = card._id;
        });

        // Thêm bộ bài (Deck)
        const decks = data.decks.map(deck => ({
            deckName: deck.deckName,
            description: deck.description,
            userId: new mongoose.Types.ObjectId(deck.userId),  // Chuyển userId thành ObjectId
            cards: deck.cards.map(cardName => cardMap[cardName]), // Chuyển cards thành ObjectId
        }));
        await Deck.insertMany(decks);

        // Thêm yêu cầu (Request)
        const requests = data.requests.map(request => ({
            deckId: new mongoose.Types.ObjectId(request.deckId),
            userId: new mongoose.Types.ObjectId(request.userId),
            status: request.status || 'pending',
        }));
        await Request.insertMany(requests);

        console.log('Database seeded successfully');
    } catch (err) {
        console.error('Error seeding database', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
