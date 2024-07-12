import express from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
} from '../controllers/userController.js';
import {
  handleMulterError,
  upload,
  uploadToCloudinary,
} from '../middlewares/uploadFiles.js';
const userRouter = express.Router();
userRouter.post(
  `/process-register`,
  upload.single('image'),
  handleMulterError,
  uploadToCloudinary,
  processRegister
);
userRouter.post(`/verify`, activateUser);
userRouter.get(`/`, getUsers);
userRouter.get(`/:id`, getUserById);
userRouter.delete(`/:id`, deleteUserById);
export { userRouter };
