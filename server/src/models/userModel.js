import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { defaultImagePath } from '../secret.js';
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxLength: [31, 'The length of user name can be maximum 31 ch'],
      minLength: [3, 'Minimum 3 Characters'],
    },
    email: {
      type: String,
      required: [true, 'User Email is required'],
      trim: true, // ..... ahnaf .....
      unique: true,
      lowercase: true,
      validator: (v) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      massage: 'Please enter a valid email',
    },
    password: {
      type: String,
      required: [true, 'User Password is required'],
      minLength: [6, 'The length of user password can be minimum 6 characters'],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)), // hash pass 10,
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      required: [true, 'User Address is required'],
    },
    phone: {
      type: String,
      required: [true, 'User Phone is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const User = model('Users', userSchema);
export { User };
