import 'dotenv/config';
const serverPort = process.env.SERVER_PORT || 3001;
const mongoDbUrl =
  process.env.MONGODB_ATLAS_URI || process.env.MONGODB_COMPASS_URI;
const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || '../public/images/users/user.jpg';
const JwtActivationKey =
  process.env.JWT_ACTIVATION_KEY ||
  '9baa535bbfa0e90da0fe8c8f524b9046de08d1525e9b4232b8978f9ca860bd2da3acf3d14c1c5dc54ee17694a06a2a52bb84003bc46b8eb6139559f3fbd3f1be';
const JwtAccessKey =
  process.env.JWT_ACCESS_KEY ||
  '1876458c39eb46113159259d61a15e14a6381c525eaecc70951a06e8494d4f7e08232d3fcd57a7742c797edbc50b81e669c0b8e251731bff3556e29c4cb8a007';
const JwtRefreshKey =
  process.env.JWT_REFRESH_KEY ||
  '4fc34d5febdf9a92fc2e72ed2f9e09fa91af2bf8e3fc88b77c53e3d95210a1f172b3bae1f9fc9b2357789bfe2e576c7bf4b51152e4e70714c60f1cd66a903828';
const JwtForgetPassKey =
  process.env.JWT_FORGET_PASS_KEY ||
  '3e245eec0bf023f1b79296845a3b3edec52ce61f69042e60557f2dd69a07a355d7ad736c33ce87254038e2579c1ac16d4e1647cc733da0c54b78ef29d0291fe8';
const SmtpUserName = process.env.SMTP_USERNAME || '';
const SmtpUserPass = process.env.SMTP_PASSWORD || '';
const clientUrl = process.env.CLIENT_URL;

export {
  serverPort as port,
  mongoDbUrl,
  defaultImagePath,
  JwtActivationKey,
  JwtAccessKey,
  SmtpUserName,
  SmtpUserPass,
  clientUrl,
  JwtForgetPassKey,
  JwtRefreshKey,
};
