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

exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { // first paramenter is the ID of the document that is to be updated. Second param is the data that we want to change  
      // this updates the fields that are different in the body. This wont work with 'put' method , only with 'patch'. Therefore, the patch method is more useful that the 'put' method 
      new: true, // this way the new updated document is the one that will be returned
      runValidators: true // each time that we update a certain document, then the validators that we specified in the schema will run again.
    }) 
    
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/*
All the findByIdAndUpdate, findById, find methods are query methods.

findById is a shortcut for findOne.

Model.deleteMany()
Model.deleteOne()
Model.find()
Model.findById()
Model.findByIdAndDelete() // 
Model.findByIdAndRemove() // these are shortcuts for Model.findOneAndRemove(), Model.findOneAndReplace(), Model.findOneAndUpdate()
Model.findByIdAndUpdate() //
Model.findOne()
Model.findOneAndDelete()
Model.findOneAndRemove()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()

*/
