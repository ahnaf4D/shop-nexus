import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import { findWithId } from '../services/findItem.js';
import { deleteImage, extractPublicId } from '../helper/deleteImage.js';
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
    if (user) {
      await deleteImage(user.image);
    }
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
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

    // Save the image buffer to the temporary storage
    addImageBuffer(email, imageBuffer);

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

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'nexus-shop-assets', // Specify the folder name
            public_id: `${Date.now()}_${name.split(' ')[0]}`, // Optional: rename uploaded file
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(imageBuffer); // Use the image buffer from the temporary storage
      });

      const user = await User.create({
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
  console.log('hit on the update server');
  try {
    const userId = req.params.id;
    const updateOptions = { new: true, runValidation: true, context: 'query' };
    let update = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.password) update.password = req.body.password;
    if (req.body.phone) update.phone = req.body.phone;
    if (req.body.address) update.address = req.body.address;
    const user = await User.findById(userId);
    if (!user) {
      return successResponse(res, {
        statusCode: 404,
        message: 'User Not Found',
      });
    }
    const image = req.file;
    if (image) {
      const publicId = user.image ? extractPublicId(user.image) : userId;
      console.log(publicId);
      try {
        await cloudinary.uploader
          .upload_stream(
            {
              folder: 'nexus-shop-assets',
              public_id: publicId,
              overwrite: true,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) {
                console.error('Error uploading to Cloudinary:', error);
                throw error;
              }
              update.image = result.secure_url;
            }
          )
          .end(image.buffer);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading image',
        });
      }
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
      });
    }

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
export {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUser,
  updateUserById,
};
