import createHttpError from 'http-errors';
import { User } from '../models/userModel.js';
import { successResponse } from './responseController.js';
import { findWithId } from '../services/findItem.js';
import { deleteImage } from '../helper/deleteImage.js';

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
    return successResponse(res, {
      statusCode: 200,
      massage: 'users were returned successfully',
      payload: { user },
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
    // fs.access(userImagePath)
    //   .then(() => fs.unlink(userImagePath))
    //   .then(() => console.log('user image was deleted'))
    //   .catch((err) => console.error('user image does not exits'));

    // fs.access(userImagePath, (err) => {
    //   if (err) {
    //     console.error('user image does not exits');
    //   } else {
    //     fs.unlink(userImagePath, (err) => {
    //       if (err) throw err;
    //       console.log('user image was deleted');
    //     });
    //   }
    // });
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
    const newUser = {
      name,
      email,
      password,
      phone,
      address,
    };
    console.log(newUser);

    return successResponse(res, {
      statusCode: 200,
      massage: 'user was created successfully',
      payload: newUser,
    });
  } catch (error) {
    next(error);
  }
};
export { getUsers, getUserById, deleteUserById, processRegister };
