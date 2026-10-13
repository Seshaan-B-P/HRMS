const express = require('express');
const router = express.Router();
const { getSetupStatus, setupFirstAdmin, register, login, logout, getMe, forgotPassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/setup-status', getSetupStatus);
router.post('/setup-admin', setupFirstAdmin);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', forgotPassword);

module.exports = router;

