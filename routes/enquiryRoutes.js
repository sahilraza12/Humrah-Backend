import express from 'express';
import { 
  createEnquiry, 
  getEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from '../controllers/enquiryController.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Public: Koi bhi customer query bhej sakta hai
router.post('/', createEnquiry);

// Protected: Sirf logged-in Admin hi inquiries fetch, update ya delete kar sakta hai
router.get('/', protect, admin, getEnquiries);
router.put('/:id', protect, admin, updateEnquiryStatus);
router.delete('/:id', protect, admin, deleteEnquiry);

export default router;