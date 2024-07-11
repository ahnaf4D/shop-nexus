import express from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import xss from 'xss';
import { rateLimit } from 'express-rate-limit';
import { userRouter } from './routers/userRouter.js';
import seedRouter from './routers/seedRouter.js';
import { errorResponse } from './controllers/responseController.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const raterLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  massage: 'Too many requests from you ip please try again later',
});
app.use(raterLimiter);
app.use(morgan('dev'));
// xss attack prevent endpoint
app.use((req, res, next) => {
  req.body = JSON.parse(
    JSON.stringify(req.body, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  req.query = JSON.parse(
    JSON.stringify(req.query, (key, value) =>
      typeof value === 'string' ? xss(value) : value
    )
  );
  next();
});

// routers
app.use('/api/users', userRouter);
app.use('/api/seeds', seedRouter);
// root endpoint below
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the Nexus Server' });
});
// Error handling middleware for unknown routes
app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found'));
});

// General error handling middleware
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});
export default app;
