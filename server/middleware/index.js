const { authorize } = require('./authorize');
const { validate } = require('./validation');
const { storeFile } = require('./upload');

module.exports = {
  authorize,
  validate,
  storeFile,
};
