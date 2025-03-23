const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);

const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

module.exports = router;