import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import { findWithId } from '../services/findItem.js';
import { v2 as cloudinary } from 'cloudinary';
import {
  createJsonWebToken,
  verifyJsonWebToken,
} from '../helper/jsonwebtoken.js';
import { clientUrl, JwtActivationKey } from '../secret.js';
import { sendEmailWithNodeMailer } from '../helper/email.js';
import { CLOUDINARY_CONFIG } from '../config/config.js';
import { addImageBuffer, getImageBuffer } from '../helper/storeBuffer.js';
import { runValidation } from '../validators/index.js';
import { updateUserImage, uploadImage } from '../helper/cloudinary.js';
import {
  deleteUserWithId,
  findUserById,
  findUsers,
  updateUserPasswordById,
  updateUserWithId,
} from '../services/userService.js';

cloudinary.config(CLOUDINARY_CONFIG);

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const { users, pagination } = await findUsers(search, limit, page);
    return successResponse(res, {
      statusCode: 200,
      message: 'Users were returned successfully',
      payload: {
        users,
        pagination,
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
    const user = await findUserById(id, options);

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
    await deleteUserWithId(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: 'User was deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const imageBuffer = req.file.buffer; // Save image in memory buffer

    const userExists = await User.exists({ email });
    if (userExists) {
      throw createHttpError(
        409,
        'User with this email already exists, please login'
      );
    }

    addImageBuffer(email, imageBuffer); // save image to buffer
    const token = createJsonWebToken('10m', JwtActivationKey, {
      name,
      email,
      password,
      phone,
      address,
    });

    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h2>Hello ${name}!</h2>
        <p>Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    };

    try {
      await sendEmailWithNodeMailer(emailData);
    } catch (error) {
      next(createHttpError(500, 'Failed to send verification email'));
      return;
    }

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

      const { name, email, password, phone, address } = decoded;

      // Retrieve the image buffer from the temporary storage
      const imageBuffer = getImageBuffer(email);
      if (!imageBuffer) throw createHttpError(404, 'Image not found');

      const result = await uploadImage(imageBuffer, name);

      await User.create({
        name,
        email,
        password,
        phone,
        address,
        image: result.secure_url, // Use the Cloudinary URL here
        imagePublicId: result.public_id, // Save the public ID in the database
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

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUserWithId(userId, req);

    return successResponse(res, {
      statusCode: 200,
      message: 'User updated successfully',
      payload: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
const banUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidation: true, context: 'query' };
    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select('-password');
    if (!updateUser) {
      throw createHttpError(404, 'User was not banned successfully');
    }
    return successResponse(res, {
      statusCode: 200,
      message: 'user was banned successfully',
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};
const unBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidation: true, context: 'query' };
    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select('-password');
    if (!updateUser) {
      throw createHttpError(404, 'User was not unbanned successfully');
    }
    return successResponse(res, {
      statusCode: 200,
      message: 'user was unbanned successfully',
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};
const updateUserPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;
    const updatedUser = await updateUserPasswordById(
      email,
      userId,
      oldPassword,
      newPassword,
      confirmPassword
    );
    return successResponse(res, {
      statusCode: 200,
      message: 'user password was updated successfully',
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
export {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
  updateUserById,
  banUserById,
  unBanUserById,
  updateUserPassword,
};
