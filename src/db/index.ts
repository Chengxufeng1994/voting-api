import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};

export { connectDatabase };
