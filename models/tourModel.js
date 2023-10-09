const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], 
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

const Tour = new mongoose.model('Tour', tourSchema); 

module.exports = Tour
/*
We exports the Tour.
Where we need this Tour? Where are we going to create, 
query, delete, update tours?
- In the tourController
*/
