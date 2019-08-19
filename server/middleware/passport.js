const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// Load User model
const User = mongoose.model('User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email', session: false }, async (email, password, done) => {
      try {
        // Match user and compare passwords
        const user = await User.findOne({ email });
        if (!user || !user.validatePassword(password)) {
          return done(null, false);
        }
        // Login success. User exists and passwords matched
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
};
