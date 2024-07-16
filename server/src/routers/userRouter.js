import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
  updateUserById,
  banUserById,
  unBanUserById,
  updateUserPassword,
  forgetUserPassword,
} from '../controllers/userController.js';
import { handleMulterError, upload } from '../middlewares/uploadFiles.js';
import {
  validateUserForgetPassword,
  validateUserPasswordUpdate,
  validateUserRegistration,
} from '../validators/auth.js';
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
userRouter.put('/ban-user/:id', isLoggedIn, isAdmin, banUserById);
userRouter.put('/unban-user/:id', isLoggedIn, isAdmin, unBanUserById);
userRouter.put(
  '/update-password/:id',
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  updateUserPassword
);
userRouter.post(
  '/forget-password/:id',
  validateUserForgetPassword,
  runValidation,
  forgetUserPassword
);
export { userRouter };
