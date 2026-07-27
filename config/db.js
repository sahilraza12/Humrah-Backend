import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // process.env.MONGO_URI humne .env file mein banaya hai
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Agar connect na ho toh app ko stop kar do
  }
};

export default connectDB;