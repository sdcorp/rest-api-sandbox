//  Custom Validators

/**
 * Check if contains only supported fields
 * @param {Object} val Req.body Object or another obj
 * @param {Array} arr Array of strings
 */
exports.bodyWithSupportedFields = (val, arr) => Object.keys(val).every(field => arr.includes(field));

exports.bodyIsEmpty = bodyObj => Object.keys(bodyObj).length !== 0;
