/*
  This is a file of data and helper functions
*/

// TODO Make custom express-validator and custom static mongoose property - findUserByEmail

/**
 * Short util handler, which allows us accept only JSON type of our req
 * @param {Object} req Request obj from our controller
 * @param { { msg:string, status:number } } options Custom error message
 * @returns {Error} Return Error if req headers is not JSON type
 */
exports.acceptOnlyJson = (req, options = {}) => {
  const { msg = 'Accept only application/json', status = 406 } = options;
  if (!req.is('application/json')) {
    const err = new Error(msg);
    err.status = status;
    throw err;
  }
};

/**
 * Helper for checking if doc with id is exist in model
 * @param {'MongoId'} id Document Id
 * @param {'MongooseModel'} Model Name of Mongoose model
 * @param { { entity:string, status:number, customMessage:string } } options Settings object. Like custom error message, status, etc.
 * @returns {'Object or Error'} Return Promise generally. But result is an Object or Error
 */
exports.checkIfExist = async (id, Model, options = {}) => {
  // default options
  const { entity = `Document`, status = 404, customMessage } = options;
  // Find in Model
  const found = await Model.findById(id);
  // If not found - generate error and throw it next
  if (!found) {
    const err = new Error(customMessage || `${entity} with id [${id}] is not found`);
    err.status = status;
    throw err;
  }
  return found;
};

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);
