import express from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import xssClean from 'xss';
import { rateLimit } from 'express-rate-limit';
import { userRouter } from './routers/userRouter.js';
const app = express();
const raterLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 5,
  massage: 'Too many requests from you ip please try again later',
});
app.use(raterLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.body = JSON.parse(
    JSON.stringify(req.body, (key, value) =>
      typeof value === 'string' ? xssClean(value) : value
    )
  );
  req.query = JSON.parse(
    JSON.stringify(req.query, (key, value) =>
      typeof value === 'string' ? xssClean(value) : value
    )
  );
  next();
});
app.use(morgan('dev'));
// routers
app.use('/api/users', userRouter);
// root endpoint below
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the Nexus Server' });
});
// error handling
app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found'));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});
export default app;
