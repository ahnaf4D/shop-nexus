import jwt from 'jsonwebtoken';
const createJsonWebToken = (expiresIn, secretKey, payload) => {
  if (typeof payload != 'object' || !payload) {
    throw new Error('Payload must be a not a non-empty object');
  }
  if (typeof secretKey != 'string' || secretKey === '') {
    throw new Error('Secret Key must not be a non-empty string.');
  }
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });
    return token;
  } catch (error) {
    console.error('Failed to sign jwt : ', error);
    throw error;
  }

  // return token;
};
const verifyJsonWebToken = (token, activationKey) => {
  const decoded = jwt.verify(token, activationKey);
  return decoded;
};
export { createJsonWebToken, verifyJsonWebToken };
