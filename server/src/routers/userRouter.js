import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
} from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, getUserById);
userRouter.delete(`/:id`, deleteUserById);
export { userRouter };
