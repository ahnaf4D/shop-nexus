import { validationResult } from 'express-validator';
import { errorResponse } from '../controllers/responseController.js';
const runValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty) {
      console.log(errors);
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg,
      });
    }
    return next();
  } catch (error) {
    next();
  }
};
export { runValidation };
