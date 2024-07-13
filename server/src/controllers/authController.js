import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import bcrypt from 'bcryptjs';
import { createJsonWebToken } from '../helper/jsonwebtoken.js';
import { JwtAccessKey } from '../secret.js';

const userLogin = async (req, res, next) => {
  try {
    // Get email and password from body
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(
        404,
        'User does not exist with this email, please register first'
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, 'Email or password did not match');
    }
    if (user.isBanned) {
      throw createHttpError(
        401,
        'You are banned. Please contact the authority'
      );
    }

    // Generate token and set httpOnly cookie
    const accessToken = createJsonWebToken('10m', JwtAccessKey, {
      userId: user._id,
    });
    res.cookie('accessToken', accessToken, {
      maxAge: 10 * 60 * 1000, // 10 minutes
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'User logged in successfully',
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};
const userLogOut = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    return successResponse(res, {
      statusCode: 200,
      message: 'User Logged out successfully',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

export { userLogin, userLogOut };
