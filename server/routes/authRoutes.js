const express = require('express');
const { body, query } = require('express-validator');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const { login, register, checkExistUsername } = require('../controllers/authController');
const { authorize } = require('../middleware/authorize');

const router = express.Router();

router.route('/register').post(
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    body('username', 'Username is required')
      .not()
      .isEmpty(),
  ],
  catchAsyncErrors(register)
);

router.route('/login').post(
  [
    body('email', 'Email is required')
      .not()
      .isEmpty(),
    body('password', 'Password is required')
      .not()
      .isEmpty(),
  ],
  login
);

router.route('/checkToken').get(authorize);

router.route('/checkExistUsername').get(
  [
    query('username')
      .not()
      .isEmpty(),
  ],
  catchAsyncErrors(checkExistUsername)
);

module.exports = router;
