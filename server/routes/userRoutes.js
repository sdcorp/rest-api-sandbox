const express = require('express');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const { authorize } = require('../controllers/authController');
const { getProfile, editProfile, deleteProfile } = require('../controllers/userController');

const router = express.Router();

router
  .route('/profile')
  .get(authorize, catchAsyncErrors(getProfile))
  .put(authorize, catchAsyncErrors(editProfile))
  .delete(authorize, catchAsyncErrors(deleteProfile));

module.exports = router;
