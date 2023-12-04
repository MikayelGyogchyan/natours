const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], 
    unique: true,
    trim: true 
  },
  slug: String ,
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
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false // usually tours are not secret
  }
}, 

{
  toJSON: { virtuals: true}, 
  toObject: { virtuals: true}
});

tourSchema.virtual('durationWeeks').get(function() { 
    return this.duration / 7 
})

tourSchema.pre('save', function(next) { 
  this.slug = slugify(this.name, {lower: true})
  next() 
}) 

// 106. Query Middleware
/*
Query Middleware allows us to run functions before or after a certain query
is executed.
*/

// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) { // /^find/ is regExp, which says that this middleware should be executed for all the commands (strings) that start with the name find 
  // find will make this query middleware and not doc middleware
  // here the 'this' will now point at the current query and not at the current document. Because we are proccessing a query here
  // creating secret tour field
  this.find({secretTour: { $ne: true }})

  this.start = Date.now() // line 98
  next()
})
// Specifying a post middleware for find
// this middleware will run after the query has already executed. Therefore it can have access to the docs that were returned
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // Query took 132 milliseconds
  console.log(docs);
  next()
})

const Tour = new mongoose.model('Tour', tourSchema); 

module.exports = Tour

