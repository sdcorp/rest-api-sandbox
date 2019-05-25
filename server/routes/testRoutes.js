const express = require('express');
const { check, body, param } = require('express-validator/check');

const { catchErrors } = require('../helpers/errorHandlers');
const { bodyWithSupportedFields, bodyIsEmpty } = require('../helpers/customValidators');
const { getData, postData, getSingleDoc, deleteSingleDoc, editSingleDoc } = require('../controllers/testController');

const router = express.Router();

//  CRUD

router
  .route('/test')
  .get(catchErrors(getData))
  .post(
    [check('email', 'Invalid email').isEmail(), check('tel', 'Invalid tel').isMobilePhone('uk-UA')],
    catchErrors(postData)
  );

router
  .route('/test/:id')
  .get([param('id', 'Invalid id parameter').isMongoId()], catchErrors(getSingleDoc))
  .put(
    [
      param('id', 'Invalid id parameter').isMongoId(),
      // TODO Read about oneOf in express-validator documentation. Maybe it helps make code more nicely
      body()
        .custom(bodyIsEmpty)
        .withMessage('Body is empty')
        .custom(bodyObj => bodyWithSupportedFields(bodyObj, ['email', 'tel']))
        .withMessage('You provide unnsupported fields'),
      check('email', 'Invalid email')
        .isEmail()
        .optional(),
      check('tel', 'Invalid tel')
        .isMobilePhone('uk-UA')
        .optional(),
    ],
    catchErrors(editSingleDoc)
  )
  .delete([param('id', 'Invalid id parameter').isMongoId()], catchErrors(deleteSingleDoc));

module.exports = router;
