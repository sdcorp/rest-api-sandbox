const express = require('express');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const middleware = require('../middleware');
const { getProfile, editProfile, deleteProfile } = require('../controllers/userController');

const router = express.Router();

router
  .route('/profile')
  .all(middleware.authorize)
  .get(catchAsyncErrors(getProfile))
  .put(catchAsyncErrors(editProfile))
  .delete(catchAsyncErrors(deleteProfile));

module.exports = router;
