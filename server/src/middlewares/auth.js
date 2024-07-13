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
const isAdmin = async (req, res, next) => {
  try {
    console.log('from admin : ', req.user.isAdmin);
    // if user isAdmin status `false` user see the error below
    if (req.user.isAdmin === false) {
      console.log(req.user.isAdmin);
      throw createHttpError(
        403,
        'Forbidden. You must be an admin to access these resource'
      );
    }
    next();
  } catch (error) {
    next();
  }
};

export { isLoggedIn, isLoggedOut, isAdmin };
