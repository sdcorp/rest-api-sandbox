const HttpError = require('http-errors');
const nodemailer = require('nodemailer');

/*
  This is a file of data and helper functions
*/

/**
 * Short util handler, which allows us accept only JSON type of our req
 * @param {Object} req Request obj from our controller
 * @returns {Error} Return Error if req headers is not JSON type
 */
exports.acceptOnlyJson = req => {
  if (!req.is('application/json')) {
    throw new HttpError[406]('Accept only application/json. Please provide correct Content-Type');
  }
};

/**
 * Helper for checking if doc with id is exist in model
 * @param  { { field:string, value:string } } conditions Document Id
 * @param {'MongooseModel'} Model Name of Mongoose model
 * @param { { entity:string, status:number, customMessage:string } } options Settings object. Like custom error message, status, etc.
 * @returns {'Object or Error'} Return Promise generally. But result is an Object or Error
 */
exports.checkIfExist = async (conditions, Model, options = {}) => {
  // default conditions
  const { field = '_id', value, id } = conditions;
  // default options
  const { entity = `Document`, status = 404, customMessage } = options;
  // Find in Model
  const found = await Model.findOne({ [field]: value || id });
  // If not found - generate error and throw it next
  if (!found) {
    const err = new Error(customMessage || `${entity} is not found`);
    err.status = status;
    throw err;
  }
  return found;
};

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

exports.configureMailerTransporter = async () => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  return transporter;
};
