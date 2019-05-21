const path = require('path');
const { validationResult } = require('express-validator/check');

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found! Wrong route');
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors
*/

exports.dbValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const data = Object.entries(err.errors).map(([schemaField, errObj]) => ({
    schemaField, // field in Schema
    message: `${errObj.path.charAt(0).toUpperCase() +
      errObj.path.slice(1)} is ${errObj.kind}`, // message from required field in Schema
  }));
  const dbError = new Error('DB Validation failed!');
  dbError.status = 422;
  dbError.data = data;
  next(dbError);
};

/*
  Express-validator wrapper handler

  Short util handler if express validation failed
*/
exports.catchExpValidatorErrors = (
  req,
  status = 422,
  msg = 'Validation failed'
) => {
  // validation params id
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(msg);
    err.status = status;
    err.data = errors.array();
    throw err;
  }
};

// Short util handler accept only JSON type of req
exports.acceptOnlyJson = (
  req,
  status = 406,
  msg = 'Accept only application/json'
) => {
  if (!req.is('application/json')) {
    const err = new Error(msg);
    err.status = status;
    throw err;
  }
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const stackFormatted = err.stack
    .split('\n')
    .map(i => i.replace(__dirname.split('/server')[0], '').trim())
    .slice(0, 5);
  // Create error response
  const errorDetails = {
    message: err.message,
    status: err.status,
    data: err.data,
    stackFormatted,
  };
  res.status(err.status || 500).json(errorDetails);
};

/*
  Production Error Handler

  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message, error: {} });
};
