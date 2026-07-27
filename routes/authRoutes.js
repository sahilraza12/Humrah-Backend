import express from 'express';
import { 
  loginUser, 
  registerUser, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';

const router = express.Router();

// 1. Dynamic Admin Registration
router.post('/register', registerUser);

// 2. Admin Login
router.post('/login', loginUser);

// 3. Forgot Password - Send OTP
router.post('/forgot-password', forgotPassword);

// 4. Reset Password - Verify OTP & Update Password
router.post('/reset-password', resetPassword);

export default router;