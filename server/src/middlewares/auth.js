import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { JwtAccessKey } from '../secret.js';
import { verifyJsonWebToken } from '../helper/jsonwebtoken.js';
const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createHttpError(401, 'Access Token Not Found');
    }
    const decoded = verifyJsonWebToken(accessToken, JwtAccessKey);
    if (!decoded) {
      throw createHttpError(401, 'Invalid Access Token');
    }
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
  }
};
const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = verifyJsonWebToken(accessToken, JwtAccessKey);
      if (decoded) {
        throw createHttpError(400, 'User is already logged in');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
export { isLoggedIn, isLoggedOut };
