const mongoose = require('mongoose');
const config = require('./config');

// Switching beetween local and development(for public repo) enviroment

require('custom-env').env();

// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', err => console.error(`🙅  🚫   🙅  🚫   🙅  🚫   🙅  🚫  ➞ ➞ ➞  ${err.message}`));

// import of all our model
require('./models/User');
require('./models/Post');

// Start our app!
const app = require('./app');

const { port } = config;
const server = app.listen(port, () => {
  console.log(`Server running  ➞  PORT ${port} and Swagger link  ➞  http://localhost:${port}/api-docs`);
});
