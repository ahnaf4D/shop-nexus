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

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nexus-shop-assets', // Specify the folder name
          public_id: `${Date.now()}_${path.parse(req.file.originalname).name}`, // Optional: rename uploaded file
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    req.cloudinaryUrl = result.secure_url;
    next();
  } catch (error) {
    next(createHttpError(400, error.message));
  }
};

export { upload, handleMulterError, uploadToCloudinary };
