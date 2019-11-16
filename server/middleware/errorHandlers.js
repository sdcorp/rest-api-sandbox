const HttpError = require('http-errors');

/*
  Catch ErrorHandler
  Attaching to each async controller catch statement. So we don't need handle error manually
  You must wrap your async controller. Ex. catchAsyncErrors(asyncFunc)
*/
const catchAsyncErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

/*
  Not Found Error Handler
  If we hit a route that wasn't found, we mark it as 404 and pass it along to the next error handler to display
*/
const notFound = (req, res, next) => next(new HttpError[404]('Not Found! Wrong api endpoint'));

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors and show them in well formatted obj
*/
const dbValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err); // if no MongoDB shema errors - move next
  const data = Object.entries(err.errors).map(([schemaField, errObj]) => ({
    schemaField, // field in Schema
    // message from required field in Schema
    message: `${errObj.path.charAt(0).toUpperCase() + errObj.path.slice(1)} is ${errObj.kind}`,
  }));
  const dbError = new HttpError[422]('DB Validation failed!');
  dbError.data = data;
  next(dbError);
};

/*
  Development Error Handler
  Catch all errors in our controllers
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, 
  we can show info on what happened
*/
const developmentErrors = (err, req, res, next) => {
  const { message, status, data } = err;
  err.stack = err.stack || '';
  // Formatting our error stack trace little bit
  const stackTraceFormatted = err.stack
    .split('\n')
    .map(i => i.replace(__dirname.split('/server')[0], '').trim())
    .slice(0, 5);

  // Send error response
  res.status(err.status || 500).json({ message, status, data, stackTraceFormatted });
};

/*
  Production Error Handler
  No stacktraces are leaked to user
*/
const productionErrors = (err, req, res, next) => {
  const { message, status, data } = err;
  res.status(status || 500).json({ message, status, data });
};

module.exports = {
  catchAsyncErrors,
  notFound,
  dbValidationErrors,
  developmentErrors,
  productionErrors,
};
