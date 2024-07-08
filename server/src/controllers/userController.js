import { posts, users } from '../models/userModel.js';

const getUsers = (req, res, next) => {
  try {
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
const getUserPosts = (req, res) => {
  res.status(200).send(posts);
};
export { getUsers, getUserPosts };
