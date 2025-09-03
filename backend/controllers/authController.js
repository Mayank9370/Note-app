const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const emailService = require('../utils/email');

// @desc    Register user
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      } else {
        const otp = existingUser.generateOTP();
        await existingUser.save();
        await emailService.sendOTP(email, otp, name);
        return res.status(200).json({
          success: true,
          message: 'User already registered but not verified. New OTP sent to email.'
        });
      }
    }

    const user = new User({ name, email, password });
    const otp = user.generateOTP();
    await user.save();
    await emailService.sendOTP(email, otp, name);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP verification.'
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ success: false, message: 'User is already verified' });

    if (!user.verifyOTP(otp)) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.clearOTP();
    await user.save();

    await emailService.sendWelcomeEmail(user.email, user.name);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
};

// @desc    Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.isVerified) return res.status(400).json({ success: false, message: 'User is already verified' });

    const otp = user.generateOTP();
    await user.save();
    await emailService.sendOTP(email, otp, user.name);

    res.status(200).json({ success: true, message: 'New OTP sent to your email' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error while resending OTP' });
  }
};

// @desc    Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    if (user.isLocked()) return res.status(423).json({
      success: false,
      message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
    });

    if (!user.isVerified) return res.status(400).json({ success: false, message: 'Please verify your email before logging in' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.loginAttempts > 0) await user.resetLoginAttempts();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user
exports.getMe = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// @desc    Logout user
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
