import 'dotenv/config';
const serverPort = process.env.SERVER_PORT || 3001;
const mongoDbUrl =
  process.env.MONGODB_ATLAS_URI || process.env.MONGODB_COMPASS_URI;
export { serverPort as port, mongoDbUrl };
