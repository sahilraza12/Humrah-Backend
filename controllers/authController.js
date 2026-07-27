import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// JWT Token Generator Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// --- DIRECT GMAIL TRANSPORTER USING .ENV CREDENTIALS ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'admin',
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. FORGOT PASSWORD (SEND OTP VIA REAL GMAIL)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No admin found with this email!' });
    }

    // Check if .env environment variables are loaded properly
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ 
        message: 'EMAIL_USER or EMAIL_PASS missing in .env file!' 
      });
    }

    // Generate 6-digit random OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP & Expiry (10 minutes valid)
    user.otp = generatedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Mail Options
    const mailOptions = {
      from: `"Humrah Admin Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Humrah Travel Admin',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Humrah Admin Portal Verification</h2>
          <p>Your OTP code to reset your password is:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px; font-size: 32px;">${generatedOTP}</h1>
          <p>This OTP is valid for 10 minutes only. Do not share this code with anyone.</p>
        </div>
      `,
    };

    // Send Mail strictly using Nodemailer
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'OTP sent successfully to your email!' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ 
      message: 'Failed to send OTP. Please check EMAIL_USER and EMAIL_PASS in .env file.',
      error: error.message
    });
  }
};

// 4. RESET PASSWORD (VERIFY OTP & UPDATE PASSWORD)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find User with valid OTP & unexpired time
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP!' });
    }

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ message: 'Failed to reset password.' });
  }
};