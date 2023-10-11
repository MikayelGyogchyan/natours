const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
  try{
    const tours = await Tour.find()
    
    res.status(200).json({
      status: 'success',
      results: tours.length, // .find() will return an array of all docs
      data: {
        tours
      },
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

// finding/querying documents from the database
exports.getTour = async (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id) // we have 'find' to find all, 'findOne' to find one, and 'findById' is given us from the mongoose which is the same as 'Tour.findOne({ _id: req.params.id })' = 'Tour.findById(req.params.id)'
    
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  } 
};

exports.createTour = async (req, res) => {
  try{
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body) // into the create function we pass the data that we want to store in the database as a new tour. And that data comes from the post.body - that is stored into the req.body

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour, // we send newTour along with the response to the client 
      },
    });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent !'
    })
  }
};

exports.updateTour = (req, res) => {

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};