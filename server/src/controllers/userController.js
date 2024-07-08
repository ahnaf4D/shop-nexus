const getUsers = (req, res, next) => {
  try {
    res.status(200).send({ massage: 'userss' });
  } catch (error) {
    next(error);
  }
};
export { getUsers };
