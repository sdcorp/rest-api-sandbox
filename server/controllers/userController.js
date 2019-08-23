const mongoose = require('mongoose');
const HttpError = require('http-errors');

const User = mongoose.model('User');

exports.getProfile = async (req, res) => {
  const user = await User.findOne({ email: req.email }, { password: 0 });
  if (!user) {
    throw new HttpError[404]('User not found');
  }
  res.status(200).json(user);
};
