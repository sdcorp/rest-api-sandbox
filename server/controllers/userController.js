const mongoose = require('mongoose');
const HttpError = require('http-errors');

const { acceptOnlyJson } = require('../helpers/customHandlers');

const User = mongoose.model('User');

exports.getProfile = async (req, res) => {
  const user = await User.findOne({ email: req.email }, { password: 0 });
  if (!user) {
    throw new HttpError[404]('User not found');
  }
  res.status(200).json({ message: 'Profile loaded successfully', data: user });
};

exports.editProfile = async (req, res) => {
  acceptOnlyJson(req);
  const { firstname, lastname, avatar } = req.body;
  let user = await User.findOneAndUpdate(
    { email: req.email },
    { $set: { firstname, lastname, avatar } },
    { new: true }
  );
  if (!user) {
    throw new HttpError[404]('User not found');
  }
  // Transform user. Enable gravatar virtual field
  user = user.toJSON({
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.id;
      return ret;
    },
  });
  res.status(200).json({ message: 'Profile updated successfully', data: user });
};

exports.deleteProfile = async (req, res) => {
  const user = await User.findOneAndDelete({ email: req.email });
  if (!user) {
    throw new HttpError[404]('User not found');
  }
  // delete all related posts with this user
  await user.remove();

  res.status(200).json({ message: 'Profile deleted successfully' });
};
