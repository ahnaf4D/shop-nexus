import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';

const findWithId = async (id, item, options = {}) => {
  try {
    const item = await User.findById(id, options);
    if (!item) {
      throw createHttpError(404, `${item} does exists with these id`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(404, `Invalid ${item} Id`);
    }
    throw error;
  }
};
export { findWithId };
