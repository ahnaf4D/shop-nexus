import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import bcrypt from 'bcryptjs';
import {
  createJsonWebToken,
  verifyJsonWebToken,
} from '../helper/jsonwebtoken.js';
import { JwtAccessKey, JwtRefreshKey } from '../secret.js';

const userLogin = async (req, res, next) => {
  try {
    // Get email and password from body
    const { email, password } = req.body;
    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required');
    }

    // Check if the user exists and include the password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw createHttpError(
        404,
        'User does not exist with this email, please register first'
      );
    }

    // Compare provided password with stored password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(401, 'Email or password did not match');
    }

    // Check if user is banned
    if (user.isBanned) {
      throw createHttpError(
        401,
        'You are banned. Please contact the authority'
      );
    }
    // Remove password from user object before creating tokens
    const userWithoutPass = await User.findOne({ email }).select('-password');

    // Create access token
    const accessToken = createJsonWebToken('10m', JwtAccessKey, {
      user: userWithoutPass,
    });

    // Set access token as a cookie
    res.cookie('accessToken', accessToken, {
      maxAge: 10 * 60 * 1000, // 10 minutes
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    const refreshToken = createJsonWebToken('10d', JwtRefreshKey, {
      user: userWithoutPass,
    });

    // Set refresh token as a cookie
    res.cookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return successResponse(res, {
      statusCode: 200,
      message: 'User logged in successfully',
      payload: { user: userWithoutPass },
    });
  } catch (error) {
    next(error);
  }
};

const userLogOut = async (req, res, next) => {
  try {
    // Clear cookies on logout
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return successResponse(res, {
      statusCode: 200,
      message: 'User logged out successfully',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const generateRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    // verify old refresh token
    const decoded = verifyJsonWebToken(oldRefreshToken, JwtRefreshKey);
    if (!decoded) {
      throw createHttpError(401, 'Invalid refresh token please login again');
    }
    // Create access token
    const accessToken = createJsonWebToken('10m', JwtAccessKey, {
      user: decoded.user,
    });

    // Set access token as a cookie
    res.cookie('accessToken', accessToken, {
      maxAge: 10 * 60 * 1000, // 10 minutes
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'New access token is generated',
      payload: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const decodedToken = verifyJsonWebToken(accessToken, JwtAccessKey);
    if (!decodedToken) {
      throw createHttpError(401, 'Invalid access token please login again');
    }
    return successResponse(res, {
      statusCode: 200,
      message: 'Protected resources access successfully',
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
export { userLogin, userLogOut, generateRefreshToken, handleProtectedRoute };
