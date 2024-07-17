import express from 'express';
import { runValidation } from '../validators/index.js';
import {
  generateRefreshToken,
  handleProtectedRoute,
  userLogin,
  userLogOut,
} from '../controllers/authController.js';
import { isLoggedIn, isLoggedOut } from '../middlewares/auth.js';
import { validateUserLogin } from '../validators/auth.js';
const authRouter = express.Router();
authRouter.post(
  '/login',
  validateUserLogin,
  runValidation,
  isLoggedOut,
  userLogin
);
authRouter.post('/logout', isLoggedIn, userLogOut);
authRouter.get('/refresh-token', generateRefreshToken);
authRouter.get('/protected', handleProtectedRoute);
export default authRouter;
