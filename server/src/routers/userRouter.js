import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
} from '../controllers/userController.js';
import { handleMulterError, upload } from '../middlewares/uploadFiles.js';
import { validateUserRegistration } from '../validators/auth.js';
import { runValidation } from '../validators/index.js';
const userRouter = express.Router();
userRouter.post(
  '/process-register',
  upload.single('image'),
  validateUserRegistration,
  runValidation,
  handleMulterError,
  processRegister
);
userRouter.post('/verify', activateUser);
userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, getUserById);
userRouter.delete(`/:id`, deleteUserById);
export { userRouter };
