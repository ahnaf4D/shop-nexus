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
  res.status(200).send({ massage: 'api working fine!' });
});
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
