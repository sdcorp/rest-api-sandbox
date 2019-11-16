const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const logger = require('morgan')('dev');

const middleware = require('./middleware');
const swaggerDocument = require('./swagger.json');

// API Routes
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//  Init app
const app = express();

app.use(cors());

// Passport Middlewares
middleware.passportJwt(passport);
middleware.passportLocal(passport);

// Added logging
app.use(logger);

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init Swagger. Access: /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// After allllll that above middleware, we finally handle our own routes!
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/user', userRoutes);

// If that above routes didn't work, we get 404 and forward to error handler
app.use(middleware.notFound);

// Some of DB errors
app.use(middleware.dbValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(middleware.developmentErrors);
}

// production error handler
app.use(middleware.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
