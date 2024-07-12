import createHttpError from 'http-errors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import {
  CLOUDINARY_CONFIG,
  EXPECTED_FILE_EXT,
  MAX_FILE_SIZE,
} from '../config/config.js';

cloudinary.config(CLOUDINARY_CONFIG);
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const extName = file.originalname.split('.').pop();
  if (!EXPECTED_FILE_EXT.includes(extName)) {
    return cb(new Error('File type not allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(createHttpError(400, 'Maximum File size is 1MB'));
    }
    return next(createHttpError(400, err.message));
  } else if (err) {
    return next(createHttpError(400, err.message));
  }
  next();
};

export { upload, handleMulterError };
