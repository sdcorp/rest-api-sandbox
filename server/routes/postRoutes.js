const express = require('express');
const { param, body } = require('express-validator');

const middleware = require('../middleware');
const postController = require('../controllers/postController');

const router = express.Router();

router
  .route('/')
  .get(middleware.catchAsyncErrors(postController.getPosts))
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
    middleware.catchAsyncErrors(postController.createPost)
  );

router
  .route('/post/:id')
  .get(
    middleware.validate([param('id', 'Invalid id parameter').isMongoId()]),
    middleware.catchAsyncErrors(postController.getSinglePost)
  )
  .put(
    middleware.validate([param('id', 'Invalid id parameter').isMongoId()]),
    middleware.authorize,
    middleware.catchAsyncErrors(postController.editSinglePost)
  )
  .delete(
    middleware.validate([param('id', 'Invalid id parameter').isMongoId()]),
    middleware.authorize,
    middleware.catchAsyncErrors(postController.deleteSinglePost)
  );
module.exports = router;
