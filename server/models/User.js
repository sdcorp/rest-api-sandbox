const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongodbErrorHandler);

userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function(password) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(password, salt);
};

userSchema.methods.generateJWT = function() {
  return jwt.sign({ email: this.email, userId: this._id }, process.env.SECRET);
};

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', userSchema);
