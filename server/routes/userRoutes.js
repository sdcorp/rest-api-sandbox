const express = require('express');

const middleware = require('../middleware');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/profile')
  .all(middleware.authorize)
  .get(middleware.catchAsyncErrors(userController.getProfile))
  .put(middleware.catchAsyncErrors(userController.editProfile))
  .delete(middleware.catchAsyncErrors(userController.deleteProfile));

module.exports = router;
