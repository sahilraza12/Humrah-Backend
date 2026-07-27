import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Priority: Render Environment Variable -> Fallback Local Variable
    const connString = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!connString) {
      throw new Error("MONGO_URI is missing in environment variables!");
    }

    const conn = await mongoose.connect(connString);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;