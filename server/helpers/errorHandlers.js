const HttpError = require('http-errors');

/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the each async function in
  catchAsyncErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
exports.catchAsyncErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => next(new HttpError[404]('Not Found! Wrong route'));

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors and show them in well formatted obj
*/
exports.dbValidationErrors = (err, req, res, next) => {
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
  // Create error response
  const errorDetails = {
    message: err.message,
    status: err.status,
    data: err.data,
  };
  res.status(err.status || 500).json(errorDetails);
};
