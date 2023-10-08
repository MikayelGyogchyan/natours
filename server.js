const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' }); // the reading of the variables from the file which happens here, only needs to happen once. It's then in the process and the process is the same, no matter in what file we are

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // this is called a validator, because it is used to validate our data, in this case if the name is actually there
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

const Tour = new mongoose.model('Tour', tourSchema); // we created a tour out of the schema that we created

const testTour = new Tour({
  // the 'testTour' document is an instance of the 'Tour' model.
  name: 'The Park Camper',
  price: 997
});
// now, the instance has a couple of methods on it we can use in order to interact with the database
// this will save in the Tours collection in the database. We save the document to the database
testTour
  .save()
  .then(doc => {
    console.log(doc); // the resolved value of the promise that the save method returns, is the final document as it is in the database
  })
  .catch(err => {
    console.log('ERROR: ', err);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
 