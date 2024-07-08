import { posts, users } from '../models/userModel.js';

const getUsers = (req, res, next) => {
  try {
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
const getUserPosts = (req, res, next) => {
  try {
    res.status(200).send(posts);
  } catch (error) {
    next(error);
  }
};
export { getUsers, getUserPosts };
