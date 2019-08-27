const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

mongoose.Promise = global.Promise;

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
    },
    // image: {
    //   type: String,
    // },
    // Likes
  },
  { timestamps: true }
);

postSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Post', postSchema);
