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
  startDates: [Date]
}, 

{
  toJSON: { virtuals: true}, 
  toObject: { virtuals: true}
});

tourSchema.virtual('durationWeeks').get(function() { 
    return this.duration / 7 
})

// 105. Document Middleware

// DOCUMENT MIDDLEWARE: runs before .save() and .create(). Only in .save() and .create() this middleware is gonna be executed, and not with find() or update()...
// this is for pre middleware which is gonna run before an actual event. And that event is the 'save' event
tourSchema.pre('save', function(next) { // this function will be called before an actual document is saved to the db 
  // console.log(this);
  this.slug = slugify(this.name, {lower: true})
  next() // next() will call the next middleware in the stack
}) 

// tourSchema.pre('save', function(next) {
//   console.log('Will save doc...');
//   next()
// })

// // post middleware functions are executed after all the pre middleware functions have completed 
// tourSchema.post('save', function(doc, next) { // post middleware has access not only to 'next()' but also to the document that was just saved to the database
//   console.log(doc); // logging the finished doc
//   next()
// })

const Tour = new mongoose.model('Tour', tourSchema); 

module.exports = Tour

/*
We can have middleware running before and after a certain event. 
And in the case of document middleware that event is usually the 'save' event.
Then in the middle of a function itself, we have access to the 
'this' keyword which is going to point at the currently being saved 
document
*/
