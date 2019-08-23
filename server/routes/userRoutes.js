const express = require('express');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const { authorize } = require('../controllers/authController');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.route('/profile').get(authorize, catchAsyncErrors(getProfile));

module.exports = router;
