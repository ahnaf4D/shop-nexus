import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
  updateUserById,
} from '../controllers/userController.js';
import { handleMulterError, upload } from '../middlewares/uploadFiles.js';
import { validateUserRegistration } from '../validators/auth.js';
import { runValidation } from '../validators/index.js';
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post(
  '/process-register',
  isLoggedOut,
  upload.single('image'),
  validateUserRegistration,
  runValidation,
  handleMulterError,
  processRegister
);

userRouter.post('/verify', isLoggedOut, activateUser);
userRouter.get('/', isLoggedIn, isAdmin, getUsers);
userRouter.get('/:id', isLoggedIn, getUserById);
userRouter.delete('/:id', isLoggedIn, isAdmin, deleteUserById);
userRouter.put(
  '/:id',
  upload.single('image'),
  handleMulterError,
  isLoggedIn,
  updateUserById
);

export { userRouter };
