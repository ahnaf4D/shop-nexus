import createHttpError from 'http-errors';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';
import { deleteImage, updateUserImage } from '../helper/cloudinary.js';
import mongoose from 'mongoose';
const findUsers = async (search, limit, page) => {
  try {
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

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createHttpError(404, 'User Not Found');
    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, 'Invalid search parameter');
    }
    throw error;
  }
};
const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) {
      throw createHttpError(404, 'User Not Found');
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, 'Invalid user ID');
    }
    throw error;
  }
};
const deleteUserWithId = async (id, options = {}) => {
  try {
    const user = await findUserById(id, options);
    if (user) {
      await deleteImage(user.image);
    }
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, 'Invalid user ID');
    }
    throw error;
  }
};
const updateUserWithId = async (userId, req) => {
  try {
    const updateOptions = { new: true, runValidators: true, context: 'query' };
    let update = {};
    for (let key in req.body) {
      if (['name', 'password', 'phone', 'address'].includes(key)) {
        update[key] = req.body[key];
      }
    }
    const user = await User.findById(userId);
    if (!user) {
      return successResponse(res, {
        statusCode: 404,
        message: 'User Not Found',
      });
    }
    const image = req.file;
    if (image) {
      try {
        const result = await updateUserImage(
          image.buffer,
          user.image,
          user.name
        );
        update.image = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading image',
        });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User Not Found',
      });
    }
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, 'Invalid user ID');
    }
    throw error;
  }
};
const updateUserPasswordById = async (
  email,
  userId,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createHttpError(401, 'User is not found');
    }
    if (newPassword === confirmPassword) {
      throw createHttpError(404, 'new password and confirm did not match');
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createHttpError(400, 'Old password did not match');
    }
    const filter = { userId };
    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select('-password');
    if (!updatedUser) {
      throw createHttpError(400, 'User was not updated successfully');
    }
    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createHttpError(400, 'Invalid user ID');
    }
    throw error;
  }
};
export {
  findUsers,
  findUserById,
  deleteUserWithId,
  updateUserWithId,
  updateUserPasswordById,
};
