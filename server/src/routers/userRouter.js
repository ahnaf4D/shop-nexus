import express from 'express';
import { getUserPosts, getUsers } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get(`/`, getUserPosts);
userRouter.get(`/posts`, getUsers);
export { userRouter };
