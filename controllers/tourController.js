const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query); // { difficulty: 'easy', duration: { gte: '5' } }

    // BUILD QUERY
    // 1. Filtring
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // creating an array of all the fields that we want to exlude. For tese will be used another methods and not find
    excludedFields.forEach(el => delete queryObj[el]);

    // 2. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // RegExp
    console.log(JSON.parse(queryStr)); // { difficulty: 'easy', duration: { '$gte': '5' } }

    // { difficulty: 'easy, duration: { $gte: 5}} // this is how we would manually write the filter object for the query ythat we specified
    // In postman '127.0.0.1:3000/api/v1/tours?duration[gte]=5' from which we get '{ difficulty: 'easy', duration: { gte: '5' } }'

    const query = Tour.find(JSON.parse(queryStr));

    // EXECUTE QUERY
    const tours = await query;

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
