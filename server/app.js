const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorHandlers = require('./helpers/errorHandlers');
const testRoutes = require('./routes/testRoutes');

//  Init app
const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// After allllll that above middleware, we finally handle our own routes!
app.use('/api', testRoutes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// Some of DB errors
app.use(errorHandlers.dbValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
