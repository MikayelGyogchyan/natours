const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], 
    unique: true,
    trim: true 
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
  }, 
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
    type: String, 
    required: [true, 'A tour must have a cover image']
  },
  images: [String], 
  createdAt: { 
    type: Date,
    default: Date.now(), 
    select: false 
  },
  startDates: [Date]
}, 
// Into the mongoose.Schema we can pass in not only the schema definition 
// itself, but also an object for the schema options 
{
  toJSON: { virtuals: true}, // each time the data is outputted as JSON, we want 'virtuals: true' (the virtuals to be part of the output ) 
  toObject: { virtuals: true}
});

// this virtual prop will be created each time that we get some data out of the database. So the get() function is called a getter.
tourSchema.virtual('durationWeeks').get(function() { // 104. Virtual Properties
  return this.duration / 7 // 7 days in a week, so that's the duration in weeks.  
})
// we cannot use the Virtual Properties in a query, because they are technically not part of db

const Tour = new mongoose.model('Tour', tourSchema); 

module.exports = Tour

