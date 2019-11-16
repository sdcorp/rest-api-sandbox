const { authorize } = require('./authorize');
const { validate } = require('./validation');
const { storeFile } = require('./upload');
const errorHandlers = require('./errorHandlers');
const passportJwt = require('./passportJwt');
const passportLocal = require('./passportLocal');

module.exports = {
  passportJwt,
  passportLocal,
  authorize,
  validate,
  storeFile,
  ...errorHandlers,
};
