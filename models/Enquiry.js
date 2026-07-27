import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false, // Made optional so quick WhatsApp forms don't break
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: false,
    },
    packageTitle: {
      type: String,
      default: '',
    },
    travelDate: {
      type: String, // Kept String type so flexible dates like "Flexible" or "2026-05-20" both work
      required: false,
    },
    guests: {
      type: String, // String or Object handling
      default: '2',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Closed', 'Booked', 'Cancelled'], // Added 'Closed' matching UI
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;