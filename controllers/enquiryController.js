import Enquiry from '../models/Enquiry.js';
import mongoose from 'mongoose';

// @desc    Submit a new customer travel enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, packageId, packageTitle, travelDate, guests, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    // Prevents Mongoose CastError if packageId is invalid or dummy string
    const validPackageId = packageId && mongoose.Types.ObjectId.isValid(packageId) ? packageId : null;

    const enquiry = new Enquiry({
      name,
      email: email || '',
      phone,
      packageId: validPackageId,
      packageTitle: packageTitle || '', 
      travelDate: travelDate || 'Flexible',
      guests: guests || '2 Adult(s)',
      message: message || '',
    });

    const savedEnquiry = await enquiry.save();
    
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully!',
      data: savedEnquiry,
    });
  } catch (error) {
    console.error("Enquiry Save Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all travel enquiries for the admin dashboard
// @route   GET /api/enquiries
// @access  Public (Option A)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({})
      .populate('packageId', 'title duration price')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Public
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedEnquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Public
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await enquiry.deleteOne();
    res.json({ message: 'Enquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};