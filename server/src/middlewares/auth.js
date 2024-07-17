import createHttpError from 'http-errors';
import { JwtAccessKey } from '../secret.js';
import { verifyJsonWebToken } from '../helper/jsonwebtoken.js';
const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw createHttpError(401, 'Access Token Not Found');
    }
    const decoded = verifyJsonWebToken(accessToken, JwtAccessKey);
    console.log('Decoded Token:', decoded); // Log the decoded token
    if (!decoded) {
      throw createHttpError(401, 'Invalid Access Token');
    }
    req.user = decoded.user;
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
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export { isLoggedIn, isLoggedOut, isAdmin };
