const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const identicon = require('identicon-github');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
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
    // Socials
    // socialMediaHandles: {
    //   type: Map,
    //   of: String,
    // },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  }
);

userSchema.plugin(mongodbErrorHandler);

userSchema.virtual('gravatar').get(function() {
  const base64icon = identicon(this.username, { pixelSize: 16 }).toDataURL();
  return base64icon;
});

userSchema.statics.findUserByEmail = function(email) {
  return this.findOne({ email });
};

userSchema.statics.findByUserName = function(username) {
  return this.findOne({ username });
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
  return { token: this.generateJWT() };
};

module.exports = mongoose.model('User', userSchema);
