const passport = require('passport');
const HttpError = require('http-errors');

exports.authorize = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, passportUser, info) => {
    if (err) {
      next(err);
    }

    if (!passportUser) {
      const accessError = new HttpError[401]('Access denied');
      accessError.data = { ...err, ...info };
      next(accessError);
    }

    const { email, _id: userId } = passportUser;
    req.email = email; // if authorized, pass email to next handler
    req.userId = userId;
    return next();
  })(req, res, next);
