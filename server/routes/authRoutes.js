const express = require('express');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const auth = require('../controllers/authController');
const middleware = require('../middleware');

const User = mongoose.model('User');
const router = express.Router();

router.route('/register').post(
  middleware.validation([
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('username', 'Username is required')
      .not()
      .isEmpty(),
  ]),
  catchAsyncErrors(auth.register)
);

router.route('/login').post(
  middleware.validation([
    body('email', 'Email is required')
      .not()
      .isEmpty(),
    body('password', 'Password is required')
      .not()
      .isEmpty(),
  ]),
  auth.login
);

router.route('/checkToken').get(middleware.authorize, (req, res) => res.status(200).json({ authenticate: true }));

router.route('/checkExistUsername').get(
  middleware.validation([
    query('username')
      .not()
      .isEmpty(),
  ]),
  catchAsyncErrors(auth.checkExistUsername)
);

router.route('/changePassword').get(
  middleware.authorize,
  middleware.validation([
    body('oldPassword').custom((value, { req }) =>
      User.findById(req.userId).then(user => {
        const passwordsMatched = user.validatePassword(value);
        if (!passwordsMatched) {
          throw new Error('Old password are wrong');
        }
      })
    ),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ]),
  auth.changePassword
);

router.route('/forgotPassword').post(
  middleware.validation([
    body('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
  ]),
  auth.forgotPassword
);

router.route('/resetPassword').post(
  middleware.validation([
    body('token', 'Reset token was not provided')
      .not()
      .isEmpty(),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ]),
  auth.resetPassword
);

module.exports = router;
