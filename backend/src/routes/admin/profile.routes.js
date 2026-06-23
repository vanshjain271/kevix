const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin-profile.controller');
const { auth } = require('../../middlewares/auth.middleware');

// Routes mapped to /api/v1/admin/profile
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);

module.exports = router;
