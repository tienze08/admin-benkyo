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

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});

const seedDatabase = async () => {
    try {
        // Đọc dữ liệu từ file data.json
        const dataPath = path.join(__dirname, '../data.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // Xóa dữ liệu cũ
        await Promise.all([
            User.deleteMany({}),
            Deck.deleteMany({}),
            Card.deleteMany({}),
            Request.deleteMany({})
        ]);

        // Thêm người dùng (mã hóa mật khẩu)
        const users = await Promise.all(data.users.map(async user => {
            return {
                name: user.name || user.username,
                username: user.username,
                password: await bcrypt.hash(user.password, 10),
                role: user.role
            };
        }));
        const insertedUsers = await User.insertMany(users);

        // Tạo một map userId để thay thế trong decks và requests
        const userMap = {};
        insertedUsers.forEach(user => {
            userMap[user.username] = user._id;
        });

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
            userId: userMap[deck.userId] || new mongoose.Types.ObjectId(),
            cards: deck.cards.map(cardFront => cardMap[cardFront] || new mongoose.Types.ObjectId())
        }));
        const insertedDecks = await Deck.insertMany(decks);

        // Tạo một map deckId để thay thế trong requests
        const deckMap = {};
        insertedDecks.forEach(deck => {
            deckMap[deck.deckName] = deck._id;
        });

        // Thêm yêu cầu (Request)
        const requests = data.requests.map(request => ({
            deckId: deckMap[request.deckId] || new mongoose.Types.ObjectId(),
            userId: userMap[request.userId] || new mongoose.Types.ObjectId(),
            status: request.status || 'pending'
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