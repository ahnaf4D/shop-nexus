import data from '../data.js';
import { User } from '../models/userModel.js';

const seedUser = async (req, res, next) => {
  try {
    // deleting all existing users
    await User.deleteMany({});
    // inserting  new users
    const users = await User.insertMany(data.users);
    // successful response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};
export { seedUser };
