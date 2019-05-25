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

  Detect if there are mongodb validation errors and show them in well formatted obj
*/

exports.dbValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const data = Object.entries(err.errors).map(([schemaField, errObj]) => ({
    schemaField, // field in Schema
    // message from required field in Schema
    message: `${errObj.path.charAt(0).toUpperCase() + errObj.path.slice(1)} is ${errObj.kind}`,
  }));
  const dbError = new Error('DB Validation failed!');
  dbError.status = 422;
  dbError.data = data;
  next(dbError);
};

/**
 * Express-validator error wrapper.
 * @param {Object} req Request object
 * @param { { msg:string, status:number } } options Settings object
 * @returns {Error} Return custom Error if Express-Validation failed
 */
exports.catchExpressValidatorErrors = (req, options = {}) => {
  // default options
  const { msg = 'Validation failed', status = 422 } = options;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(msg);
    err.status = status;
    err.data = errors.array();
    throw err;
  }
};

/*
  Development Error Handler
  Catch all errors in our controllers
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, 
  we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  // Formatting our error stack trace little bit
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
