import mongoose from 'mongoose';
import { mongoDbUrl } from '../secret.js';
const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongoDbUrl, options);
    console.log(`Connection to DB is successfully established`);
    mongoose.connection.on('error', (err) => {
      console.error('DB Connection Error', err);
    });
  } catch (error) {
    console.error('Could not connect to db', err.toString());
  }
};
export default connectDB;
