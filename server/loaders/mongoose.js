const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
  try {
    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
    const connection = await mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    return connection.connection.db;
  } catch (err) {
    console.error(`🙅  🚫   🙅  🚫   🙅  🚫   🙅  🚫  ➞ ➞ ➞  ${err.message}`);
  }
};
