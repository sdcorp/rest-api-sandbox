const { validationResult } = require('express-validator');
const HttpError = require('http-errors');

// https://express-validator.github.io/docs/running-imperatively.html#example-standardized-validation-error-response
exports.validate = validations => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const validationError = new HttpError[422]('Validation failed');
  validationError.data = errors.array();
  next(validationError);
};
