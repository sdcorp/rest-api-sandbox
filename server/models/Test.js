const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const testSchema = new mongoose.Schema(
  {
    uniqId: {
      type: String,
      unique: true,
    },
    documentName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestModel', testSchema);
