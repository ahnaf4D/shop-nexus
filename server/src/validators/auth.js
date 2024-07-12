import { body } from 'express-validator';
console.log(body);
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
  body('image').optional().isString().withMessage('Phone is required'),
];
// sign in validation
export { validateUserRegistration };
