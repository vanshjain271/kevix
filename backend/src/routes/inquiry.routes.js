const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', inquiryController.createInquiry);
router.get('/', protect, authorize('ADMIN'), inquiryController.getInquiries);
router.patch('/:id/status', protect, authorize('ADMIN'), inquiryController.updateInquiryStatus);

module.exports = router;
