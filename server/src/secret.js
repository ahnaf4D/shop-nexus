import 'dotenv/config';
const serverPort = process.env.SERVER_PORT || 3001;
const mongoDbUrl =
  process.env.MONGODB_ATLAS_URI || process.env.MONGODB_COMPASS_URI;
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || '../public/images/users/user.jpg';
export { serverPort as port, mongoDbUrl, defaultImagePath };
