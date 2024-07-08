import express from 'express';
// import products from './products.json' assert { type: 'json' };
import morgan from 'morgan';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// custom middlewares
const isLoggedIn = (req, res, next) => {
  const login = true;
  if (login) {
    req.body.id = 101;
    next();
  } else {
    return res.status(401).json({ massage: 'login first' });
  }
};
const port = process.env.PORT || 3001;
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the Nexus Server' });
});
app.get(`/api/user`, isLoggedIn, (req, res) => {
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
  res.status(404).json({ massage: 'route not found' });
  next();
});
// http/server error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
