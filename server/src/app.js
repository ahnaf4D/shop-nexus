import express from 'express';
import morgan from 'morgan';
import createHttpError from 'http-errors';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// import products from './products.json' assert { type: 'json' };
// custom middlewares
// const isLoggedIn = (req, res, next) => {
//   const login = true;
//   if (login) {
//     req.body.id = 101;
//     next();
//   } else {
//     return res.status(401).json({ massage: 'login first' });
//   }
// };
const port = process.env.PORT || 3001;
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

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
export default app;
