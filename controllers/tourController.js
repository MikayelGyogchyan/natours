const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = {...req.query} // hard copying. Creating a shallow copy creating new object using this {...req.query}. 
    const excludedFields = ['page', 'sort', 'limit', 'fields'] // creating an array of all the fields that we want to exlude. For tese will be used another methods and not find
    excludedFields.forEach(el => delete queryObj[el])

    // console.log(req.query); // GET /api/v1/tours?duration=5&difficulty=easy&test=23 200 126.994 ms - 9387
    // { duration: '5', difficulty: 'easy', test: '23' }
    // like this in express we access the data that is in a query string 'duration=5&difficulty=easy&test=23'

    // console.log(req.query, queryObj); // { difficulty: 'easy', page: '2', sort: '1', limit: '10' } // { difficulty: 'easy' }

    // In mongoose there are 2 ways of writing database queries

    // 1. The first one is to use a filter object like this

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    // and as '{ duration: '5', difficulty: 'easy', test: '23' }' is the same that we have inside our .find() method, we will do this

    const query = Tour.find(queryObj);

    // 2. Some special mongoose methods

    // const query = await Tour.find() // the find() will retrun a query, therefore we can chain. Then in query.prototype w have these methods
    //   .where('duration')
    //   .equals(5) // lt, lte...
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE QUERY
    const tours = await query

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id); // in this case we don't save in a variable, because we don't send anything back to the client. In a RESTful API it is a common practice not to save any data to the client when there was a delete operation.
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
