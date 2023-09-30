const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const app = express();

// 1. Middlewares

app.use(morgan('dev'))
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next();
});
 
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// 3. Routes

// Mount our routers
// These 2 routes are middleware, which is why we can use app.use() in order to mount them 
app.use('/api/v1/tours', tourRouter); // for 'api/v1/tours' we want to apply 'tourRouter'
app.use('/api/v1/users', userRouter);

 module.exports = app;