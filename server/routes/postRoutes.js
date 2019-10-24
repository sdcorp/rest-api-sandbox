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
const middleware = require('../middleware');

const router = express.Router();

router
  .route('/')
  .get(catchAsyncErrors(getPosts))
  .post(
    middleware.validate([
      body('title', 'Title is required')
        .not()
        .isEmpty(),
      body('text', 'Text is required')
        .not()
        .isEmpty(),
    ]),
    middleware.authorize,
    catchAsyncErrors(createPost)
  );

router
  .route('/post/:id')
  .get(middleware.validate([param('id', 'Invalid id parameter').isMongoId()]), catchAsyncErrors(getSinglePost))
  .put(
    middleware.validate([param('id', 'Invalid id parameter').isMongoId()]),
    middleware.authorize,
    catchAsyncErrors(editSinglePost)
  )
  .delete(
    middleware.validate([param('id', 'Invalid id parameter').isMongoId()]),
    middleware.authorize,
    catchAsyncErrors(deleteSinglePost)
  );
module.exports = router;
