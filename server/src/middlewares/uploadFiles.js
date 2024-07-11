import createHttpError from 'http-errors';
import multer from 'multer';
import path from 'path';
import {
  EXPECTED_FILE_EXT,
  MAX_FILE_SIZE,
  UPLOAD_FILE,
} from '../config/config.js';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FILE);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(
      null,
      Date.now() + '_' + file.originalname.replace(extName, '') + extName
    );
  },
});
const fileFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  if (!EXPECTED_FILE_EXT.includes(extName.substring(1))) {
    return cb(new Error('File type not allowed'), false);
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
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
