const mongoose = require('mongoose');
const passport = require('passport');
const HttpError = require('http-errors');

const User = mongoose.model('User');
const { catchExpressValidatorErrors } = require('../helpers/customValidators');
const { acceptOnlyJson } = require('../helpers/customHandlers');

exports.register = async (req, res) => {
  acceptOnlyJson(req);
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

  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = (req, res, next) => {
  acceptOnlyJson(req);
  catchExpressValidatorErrors(req);
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
  catchExpressValidatorErrors(req);
  const { username } = req.query;
  const user = await User.findByUserName(username);
  if (user) {
    throw new HttpError[409]('Username already taken');
  }
  res.sendStatus(200);
};
