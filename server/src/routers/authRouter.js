import express from 'express';
import { runValidation } from '../validators/index.js';
import { userLogin, userLogOut } from '../controllers/authController.js';
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
export default authRouter;
