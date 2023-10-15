const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

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

// Read JSON File

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
// Import Data into Database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit()
};

// Delete all Data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // deleteMany will delete all of the docs in a certain (Tour) collection. Mongoose implemented the same function on the model
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit() // process.exit() is like the (ctrl + c), an aggresive way of stopping the app but now we aare not running a real app
};

if(process.argv[2] === '--import') {
  importData()
} else if(process.argv[2] === '--delete') {
  deleteData()
}

// typed 'node dev-data/data/import-dev-data.js' in terminal
console.log(process.argv);
/*
[
  'C:\\Program Files\\nodejs\\node.exe', // this is where the node command is located, that's equivalent to node
  'C:\\Users\\Argishti\\Desktop\\Development Mikayel\\Node.js\\complete-node-bootcamp-master\\4-natours\\final94\\dev-data\\data\\import-dev-data.js'  //  this path is this 'dev-data/data/import-dev-data.js'
]

We typed 'node dev-data/data/import-dev-data.js --import'
and get 
'C:\\Users\\Argishti\\Desktop\\Development Mikayel\\Node.js\\complete-node-bootcamp-master\\4-natours\\final94\\dev-data\\data\\import-dev-data.js',  
  '--import'
the second arg.
*/
