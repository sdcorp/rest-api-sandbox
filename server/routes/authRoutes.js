const express = require('express');
const { body, query } = require('express-validator');
const mongoose = require('mongoose');

const middleware = require('../middleware');
const authController = require('../controllers/authController');

const User = mongoose.model('User');

const router = express.Router();

router.route('/register').post(
  middleware.validate([
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('username', 'Username is required')
      .not()
      .isEmpty(),
  ]),
  middleware.catchAsyncErrors(authController.register)
);

router.route('/login').post(
  middleware.validate([
    body('email', 'Email is required')
      .not()
      .isEmpty(),
    body('password', 'Password is required')
      .not()
      .isEmpty(),
  ]),
  authController.login
);

router.route('/checkToken').get(middleware.authorize, (req, res) => res.status(200).json({ authenticate: true }));

router.route('/checkExistUsername').get(
  middleware.validate([
    query('username')
      .not()
      .isEmpty(),
  ]),
  middleware.catchAsyncErrors(authController.checkExistUsername)
);

router.route('/changePassword').get(
  middleware.authorize,
  middleware.validate([
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
  authController.changePassword
);

router.route('/forgotPassword').post(
  middleware.validate([
    body('email', 'Please include a valid email')
      .isEmail()
      .normalizeEmail(),
  ]),
  authController.forgotPassword
);

router.route('/resetPassword').post(
  middleware.validate([
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
  authController.resetPassword
);

module.exports = router;
