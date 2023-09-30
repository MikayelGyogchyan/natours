const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // the reading of the variables from the file which happens here, only needs to happen once. It's then in the process and the process is the same, no matter in what file we are

const app = require('./app');


// SET NODE_ENV=development nodemon server.js

// console.log(app.get('env')); // development // thst is the environment that we are currently in.
// console.log(process.env); // production

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
