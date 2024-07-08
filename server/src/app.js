import express from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
import xssClean from 'xss';
import { rateLimit } from 'express-rate-limit';
const app = express();
const raterLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 5, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  massage: 'Too many requests from you ip please try again later',
});
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
}); // xss package middleware
app.use(morgan('dev'));
app.use(raterLimiter);
// const port = process.env.PORT || 3001;
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the Nexus Server' });
});
app.get(`/api/user`, (req, res) => {
  console.log(`Users authenticate with ${req.body.id}`);
  res.status(200).send({ massage: 'user profile returned' });
});
app.get(`/test`, (req, res) => {
  res.status(200).send({ massage: 'GET: API working fine' });
});
app.post(`/test`, (req, res) => {
  res.status(200).send({ massage: 'POST: API working fine' });
});
app.put(`/test`, (req, res) => {
  res.status(200).send({ massage: 'PUT: API working fine' });
});
app.delete(`/test`, (req, res) => {
  res.status(200).send({ massage: 'DELETE: API working fine' });
});
// client error handling middlewares
app.use((req, res, next) => {
  next(createHttpError(404, 'Route not found'));
});
// http/server error handling middleware -> all the errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

export default app;
