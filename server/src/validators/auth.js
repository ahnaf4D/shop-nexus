import { body } from 'express-validator';
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 31 })
    .withMessage('Name should be 3-31 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'The password must include both uppercase and lowercase letters, at least one digit, and at least one special symbol.'
    ),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 3 })
    .withMessage('Address should be at least 3 characters long'),

  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('image').optional().isString().withMessage('Image is required'),
];
const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'The password must include both uppercase and lowercase letters, at least one digit, and at least one special symbol.'
    ),
];
const validateUserPasswordUpdate = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),
  body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Old password is required. Enter Your old password')
    .isLength({ min: 6 })
    .withMessage('Old Password Should be at 6 character long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'The password must include both uppercase and lowercase letters, at least one digit, and at least one special symbol.'
    ),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required. Enter Your New password')
    .isLength({ min: 6 })
    .withMessage('New Password Should be at 6 character long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'The password must include both uppercase and lowercase letters, at least one digit, and at least one special symbol.'
    ),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('New password is required. Enter Your New password')
    .isLength({ min: 6 })
    .withMessage('New Password Should be at 6 character long')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/)
    .withMessage(
      'The password must include both uppercase and lowercase letters, at least one digit, and at least one special symbol.'
    ),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password did not match');
    }
    return true;
  }),
];
// sign in validation
export {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
};
