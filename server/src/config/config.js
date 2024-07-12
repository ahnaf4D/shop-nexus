const MAX_FILE_SIZE = 2097152;
const EXPECTED_FILE_EXT = ['jpg', 'jpeg', 'png'];
const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
export { MAX_FILE_SIZE, EXPECTED_FILE_EXT, CLOUDINARY_CONFIG };
