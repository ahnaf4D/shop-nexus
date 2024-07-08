import express from 'express';
// import products from './products.json' assert { type: 'json' };

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.get(`/`, (req, res) => {
  res.status(200).send({ massage: 'Welcome to the nexus server' });
});
app.get(`/test`, (req, res) => {
  res.status(200).send({ massage: 'api working fine!' });
});
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
