import express from 'express';
// import products from './products.json' assert { type: 'json' };
import morgan from 'morgan';
const app = express();
// app.use(express.json());
app.use(morgan('dev'));
const port = process.env.PORT || 3001;
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the Nexus Server' });
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

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
