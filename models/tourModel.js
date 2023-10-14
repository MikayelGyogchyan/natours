const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], 
    unique: true,
    trim: true // trim only works with strings. For string we have a schema type which is trim, which will remove all the white space in the beginning amd in the end of the string.
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },  // we don't give these 2 props a required value, because it's not the user who creates these tours, who will specify yhese values. So when w create a new tour, we will never specify the rating's average neighter the rating's quantity, because it will later on be calculated from the real reviews 
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  
  priceDescount: Number,
  
  summary: {
    type: String,
    trim: true ,
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true 
  },
  imageCover: {
    type: String, // will be the name of the image, which we will then read from the fs. So, a reference will be stored in the db
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // we have multiple images and i want to save these images as an array (an array of strings)
  createdAt: { // this will be automatically created 
    type: Date,
    default: Date.now() // "2023-09-25T20:34:48.472Z",
  },
  startDates: [Date]
});

const Tour = new mongoose.model('Tour', tourSchema); 

module.exports = Tour
/*
We exports the Tour.
Where we need this Tour? Where are we going to create, 
query, delete, update tours?
- In the tourController
*/
