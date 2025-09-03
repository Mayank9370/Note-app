const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { signupValidation, loginValidation, otpValidation, validate } = require('../middleware/validation');

// Auth routes
router.post('/signup', signupValidation, validate, authController.signup);
router.post('/verify-otp', otpValidation, validate, authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
