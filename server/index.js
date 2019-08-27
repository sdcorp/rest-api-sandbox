const mongoose = require('mongoose');

// Switching beetween local and development(for public repo) enviroment
require('custom-env').env('development');

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => console.error(`🙅  🚫   🙅  🚫   🙅  🚫   🙅  🚫   ➞ ➞ ➞  ${err.message}`));

// import of all our model
require('./models/User');
require('./models/Post');

// Start our app!
const app = require('./app');

app.set('port', process.env.PORT || 8000);
const server = app.listen(app.get('port'), () => {
  const { port } = server.address();
  console.log(`Server running  ➞  PORT ${port} and Swagger link  ➞  http://localhost:${port}/api-docs`);
});
