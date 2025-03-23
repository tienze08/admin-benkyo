const express = require('express');
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Tạo request mới
router.post('/', authenticate, authorize(['customer']), requestController.createRequest);

// Lấy danh sách tất cả request (chỉ admin mới có quyền truy cập)
router.get('/', authenticate, authorize(['admin']), requestController.getAllRequests);

// Lấy thông tin của một request cụ thể
router.get('/:requestId', authenticate, authorize(['admin', 'customer']), requestController.getRequestById);

// Cập nhật trạng thái request (chỉ admin mới có quyền)
router.put('/:requestId', authenticate, authorize(['admin']), requestController.updateRequestStatus);

module.exports = router;
