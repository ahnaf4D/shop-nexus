import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
} from '../controllers/userController.js';
const userRouter = express.Router();
userRouter.post(`/process-register`, processRegister);
userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, getUserById);
userRouter.delete(`/:id`, deleteUserById);
export { userRouter };
