const express = require('express');
const { param, body } = require('express-validator');

const { catchAsyncErrors } = require('../helpers/errorHandlers');
const { bodyIsEmpty } = require('../helpers/customValidators');
const { getData, postData, getSingleDoc, deleteSingleDoc, editSingleDoc } = require('../controllers/testController');
const { authorize } = require('../controllers/authController');

const router = express.Router();

router
  .route('/documents')
  .get(catchAsyncErrors(getData))
  .post(
    [
      body('uniqId', 'uniqId is required')
        .not()
        .isEmpty(),
    ],
    catchAsyncErrors(postData)
  );

router
  .route('/document/:id')
  .get([param('id', 'Invalid id parameter').isMongoId()], catchAsyncErrors(getSingleDoc))
  .put(
    [
      param('id', 'Invalid id parameter').isMongoId(),
      // TODO Read about oneOf in express-validator documentation. Maybe it helps make code more nicely
      body()
        .custom(bodyIsEmpty)
        .withMessage('Body is empty'),
    ],
    authorize,
    catchAsyncErrors(editSingleDoc)
  )
  .delete([param('id', 'Invalid id parameter').isMongoId()], authorize, catchAsyncErrors(deleteSingleDoc));
module.exports = router;
