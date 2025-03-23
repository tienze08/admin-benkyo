const Request = require('../models/requestModel');
const Deck = require('../models/deckModel');
const User = require('../models/userModel');

exports.getAllRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        const requests = await Request.find()
            .populate('deckId')
            .populate('userId')
            .limit(parsedLimit)
            .skip((parsedPage - 1) * parsedLimit)
            .exec();

        const count = await Request.countDocuments();

        res.status(200).json({
            requests,
            totalPages: Math.ceil(count / parsedLimit),
            currentPage: parsedPage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const request = await Request.findById(requestId).populate('deckId').populate('userId');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        res.status(200).json({ request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createRequest = async (req, res) => {
    try {
        const { deckId, userId, status } = req.body;

        // Kiểm tra xem Deck có tồn tại không
        const deck = await Deck.findById(deckId);
        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        // Kiểm tra xem User có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Tạo request mới
        const newRequest = new Request({
            deckId,
            userId,
            status: status || 'pending', // Mặc định là 'pending' nếu không có giá trị
        });

        await newRequest.save();

        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!['approved', 'reject'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        await request.save();

        res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const bookings = await Booking.find({ userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

