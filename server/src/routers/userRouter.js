import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
} from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, getUser);
userRouter.delete(`/:id`, deleteUser);
export { userRouter };
