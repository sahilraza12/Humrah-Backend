import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc Middleware to protect routes from unauthenticated users
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization headers and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (Format: "Bearer token_string")
      token = req.headers.authorization.split(' ')[1];

      // Decode token using the same fallback secret if env is missing
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

      // Fetch user from database and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next(); // Return next to stop execution here
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no security token found' });
  }
};

// @desc Middleware to restrict access strictly to Admin users
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied, Admin privileges required' });
  }
};