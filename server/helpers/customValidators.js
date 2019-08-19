const { validationResult } = require('express-validator');

//  Custom Validators

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

/**
 * Check if contains only supported fields
 * @param {Object} val Req.body Object or another obj
 * @param {Array} arr Array of strings
 */
exports.bodyWithSupportedFields = (val, arr) => Object.keys(val).every(field => arr.includes(field));

exports.bodyIsEmpty = bodyObj => Object.keys(bodyObj).length !== 0;
