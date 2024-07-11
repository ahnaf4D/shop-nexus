import 'dotenv/config';
const serverPort = process.env.SERVER_PORT || 3001;
const mongoDbUrl =
  process.env.MONGODB_ATLAS_URI || process.env.MONGODB_COMPASS_URI;
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || '../public/images/users/user.jpg';
const JwtActivationKey =
  process.env.JWT_ACTIVATION_KEY ||
  '9baa535bbfa0e90da0fe8c8f524b9046de08d1525e9b4232b8978f9ca860bd2da3acf3d14c1c5dc54ee17694a06a2a52bb84003bc46b8eb6139559f3fbd3f1be';
const SmtpUserName = process.env.SMTP_USERNAME || '';
const SmtpUserPass = process.env.SMTP_PASSWORD || '';
const clientUrl = process.env.CLIENT_URL;

export {
  serverPort as port,
  mongoDbUrl,
  defaultImagePath,
  JwtActivationKey,
  SmtpUserName,
  SmtpUserPass,
  clientUrl,
};
