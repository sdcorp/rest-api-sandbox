const mongoose = require('mongoose');
const passport = require('passport');
const HttpError = require('http-errors');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { acceptOnlyJson, configureMailerTransporter } = require('../helpers/customHandlers');

const randomBytesAsync = promisify(randomBytes);
const User = mongoose.model('User');

exports.register = async (req, res) => {
  acceptOnlyJson(req);
  const { username, email, password } = req.body;
  //  check if user exists
  let user = await User.findUserByEmail(email);
  if (user) {
    throw new HttpError[409]('User with this email already exists');
  }
  // create user instanse
  user = new User({ username, email, password });
  // hash password
  user.hashPassword(password);
  // save user
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res, next) => {
  acceptOnlyJson(req);
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (!passportUser) {
      throw new HttpError[401]('Email or password are wrong');
    }
    const authResponse = passportUser.toAuthJSON();
    return res.status(200).json(authResponse);
  })(req, res, next);
};

exports.checkExistUsername = async (req, res) => {
  const { username } = req.query;
  const user = await User.findByUserName(username);
  if (user) {
    throw new HttpError[409]('Username already taken');
  }
  res.sendStatus(200);
};

exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;

  const user = await User.findById(req.userId);
  user.hashPassword(newPassword);
  await user.save();
  res.status(200).json({ message: 'User password updated successfully', data: user });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // find user by email
  const user = await User.findUserByEmail(email);
  if (!user) {
    throw new HttpError[404]('User with this email not found');
  }

  // generate random hash and expiration
  const resetToken = (await randomBytesAsync(20)).toString('hex');
  const resetPasswordExpires = Date.now() + process.env.RESET_MAIL_EXPIRATION_TIME || 3600000; // 1 hour from now

  // put them in DB. But don't forget clear later
  user.resetToken = resetToken;
  user.resetPasswordExpires = resetPasswordExpires;
  await user.save();

  // generate link and send to email
  const resetLink = `https://localhost:3000/auth/reset?resetToken=${resetToken}`;

  // email message
  const mailText = {
    from: 'Test REST API (sdcorp) <no-reply@sdcorp.ai>',
    to: user.email,
    subject: 'account reset password',
    html: `<h2>Hello,</h2><p>Please to reset your account password, click this <a href="${resetLink}">link</a></p><p>This link will expire in 1 hour</p>`,
  };

  // send email
  const transporter = await configureMailerTransporter();
  const info = await transporter.sendMail(mailText);

  if (!info) {
    throw new HttpError('Error while sending verification mail');
  }

  res.status(200).json({ message: 'Reset email sended successfully', data: info });
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  // find user by token from email link
  const user = await User.findOne({ resetToken, resetPasswordExpires: { $gt: Date.now() } });

  if (!user) {
    throw new HttpError[404]('Password reset failed or link has expired');
  }

  // hash new password
  user.hashPassword(newPassword);
  user.resetToken = null;
  user.resetPasswordExpires = null;

  // save in db and clear reset-data
  await user.save();

  res.status(200).json({ message: 'Password reset successfully, please re-login', data: user });
};
