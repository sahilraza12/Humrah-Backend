import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    duration: {
      type: String, // e.g., "5 Nights / 6 Days"
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tag: {
      type: String, // e.g., "Bestseller", "Honeymoon Special"
      default: '',
    },
    locations: {
      type: String, // e.g., "Srinagar, Gulmarg, Pahalgam, Sonamarg"
      default: '',
    },
    mainImage: {
      type: String, // URL of the featured image
      required: true,
    },
    gallery: [String], // Array of additional image URLs
    inclusions: {
      hotel: { type: Boolean, default: true },
      meals: { type: Boolean, default: true },
      transport: { type: Boolean, default: true },
      shikaraRide: { type: Boolean, default: false },
      flights: { type: Boolean, default: false },
    },
    itinerary: [itinerarySchema], // Embedded array of day-by-day plans
    featured: {
      type: Boolean,
      default: false, // If true, displays on the homepage
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;