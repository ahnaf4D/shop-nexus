import createHttpError from 'http-errors';
import multer from 'multer';
import path from 'path';

const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 2097152;
const uploadDir = process.env.UPLOAD_FILE;
const allowedFileTypes = process.env.EXPECTED_FILE_EXT || [
  'jpg',
  'jpeg',
  'png',
];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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
  if (!allowedFileTypes.includes(extName.substring(1))) {
    return cb(createHttpError(400, 'File type not allowed'));
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  limits: { fileSize: maxFileSize },
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
