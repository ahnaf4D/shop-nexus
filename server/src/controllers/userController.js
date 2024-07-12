import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import { findWithId } from '../services/findItem.js';
import { deleteImage } from '../helper/deleteImage.js';
import { v2 as cloudinary } from 'cloudinary';
import {
  createJsonWebToken,
  verifyJsonWebToken,
} from '../helper/jsonwebtoken.js';
import { clientUrl, JwtActivationKey } from '../secret.js';
import { sendEmailWithNodeMailer } from '../helper/email.js';
import { CLOUDINARY_CONFIG } from '../config/config.js';
cloudinary.config(CLOUDINARY_CONFIG);
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    // 24 users
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createHttpError(404, 'User Not Found');
    return successResponse(res, {
      statusCode: 200,
      massage: 'users were returned successfully',
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, 'users', options);

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return successResponse(res, {
      statusCode: 200,
      message: 'User was returned successfully',
      payload: {
        ...user.toObject(),
      },
    });
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, 'users', options);
    const userImagePath = user.image;
    deleteImage(userImagePath);
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      massage: 'users were deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    console.log(`email from the body ${email}`); // Check if email is undefined here.
    const imageUrl = req.cloudinaryUrl; // Use the Cloudinary URL from the previous middleware

    // Check if the user already exists
    const userExists = await User.exists({ email });
    if (userExists) {
      throw createHttpError(
        409,
        'User with this email already exists, please login'
      );
    }

    // Create a JWT token for account activation
    const token = createJsonWebToken('10m', JwtActivationKey, {
      name,
      email,
      password,
      phone,
      address,
      imageUrl,
    });

    // Email data for sending the activation link
    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h2>Hello ${name}!</h2>
        <p>Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    };

    // Send the activation email
    try {
      await sendEmailWithNodeMailer(emailData);
    } catch (error) {
      next(createHttpError(500, 'Failed to send verification email'));
      return;
    }

    // Send success response
    return successResponse(res, {
      statusCode: 200,
      message: 'Please activate your account with email',
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
const activateUser = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createHttpError(404, 'Token not found');

    try {
      const decoded = verifyJsonWebToken(token, JwtActivationKey);
      if (!decoded) throw createHttpError(405, 'Unable to verify user');

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createHttpError(
          409,
          'User with this email already exists, please login'
        );
      }

      const { name, email, password, phone, address, imageUrl } = decoded;

      const user = await User.create({
        name,
        email,
        password,
        phone,
        address,
        image: imageUrl, // Use the Cloudinary URL here
      });

      return successResponse(res, {
        statusCode: 201,
        message: 'User was registered successfully',
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createHttpError(401, 'Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw createHttpError(401, 'Invalid Token');
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};
export { getUsers, getUserById, deleteUserById, processRegister, activateUser };
