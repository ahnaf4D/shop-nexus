import createHttpError from 'http-errors';
import mongoose from 'mongoose';

const findWithId = async (Model, id, item, options = {}) => {
  try {
    const item = await Model.findById(id, options);
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
