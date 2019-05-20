const express = require('express');
const { check, param } = require('express-validator/check');

const { catchErrors } = require('../handlers/errorHandlers');
const {
  getData,
  postData,
  getSingleDoc,
  deleteSingleDoc,
  editSingleDoc,
} = require('../controllers/testController');

const router = express.Router();

//  CRUD

router
  .route('/test')
  .get(catchErrors(getData))
  .post([check('email', 'Invalid email').isEmail()], catchErrors(postData));

router
  .route('/test/:id')
  .get(
    [param('id', 'Invalid id parameter').isMongoId()],
    catchErrors(getSingleDoc)
  )
  .put(
    [
      param('id', 'Invalid id parameter').isMongoId(),
      check('email', 'Invalid email').isEmail(),
    ],
    catchErrors(editSingleDoc)
  )
  .delete(
    [param('id', 'Invalid id parameter').isMongoId()],
    catchErrors(deleteSingleDoc)
  );

module.exports = router;
