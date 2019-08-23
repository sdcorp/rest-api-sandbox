const mongoose = require('mongoose');
const passport = require('passport');
const HttpError = require('http-errors');

const User = mongoose.model('User');
const { catchExpressValidatorErrors } = require('../helpers/customValidators');

exports.register = async (req, res) => {
  catchExpressValidatorErrors(req);
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

  res.status(201).json({ msg: 'User registered successfully' });
};

exports.login = (req, res, next) => {
  catchExpressValidatorErrors(req);
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const token = passportUser.toAuthJSON();
      return res.status(200).json(token);
    }
    throw new HttpError[401]('Email or password are wrong');
  })(req, res, next);
};

exports.authorize = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, passportUser, info) => {
    if (err) {
      next(err);
    }
    if (passportUser) {
      const { email } = passportUser;
      req.email = email; // if authorized, pass email to next handler
      return next();
    }
    const accessError = new HttpError[401]('Access denied');
    accessError.data = info;
    throw accessError;
  })(req, res, next);

exports.checkToken = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, passportUser, info) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (passportUser) {
      return res.status(200).json({ authenticated: true });
    }
    const accessError = new HttpError[401]('Invalid token');
    accessError.data = info;
    throw accessError;
  })(req, res, next);

exports.checkExistUsername = async (req, res) => {
  catchExpressValidatorErrors(req);
  const { username } = req.query;
  const user = await User.findByUserName(username);
  if (user) {
    throw new HttpError[409]('Username already taken');
  }
  res.sendStatus(200);
};
