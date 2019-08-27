const express = require('express');
const { param, body } = require('express-validator');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const {
  getPosts,
  createPost,
  getSinglePost,
  editSinglePost,
  deleteSinglePost,
} = require('../controllers/postController');
const { authorize } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(catchAsyncErrors(getPosts))
  .post(
    [
      body('title', 'Title is required')
        .not()
        .isEmpty(),
      body('text', 'Text is required')
        .not()
        .isEmpty(),
    ],
    authorize,
    catchAsyncErrors(createPost)
  );

router
  .route('/post/:id')
  .get([param('id', 'Invalid id parameter').isMongoId()], catchAsyncErrors(getSinglePost))
  .put([param('id', 'Invalid id parameter').isMongoId()], authorize, catchAsyncErrors(editSinglePost))
  .delete([param('id', 'Invalid id parameter').isMongoId()], authorize, catchAsyncErrors(deleteSinglePost));
module.exports = router;
