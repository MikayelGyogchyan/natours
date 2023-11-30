const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  // Prefilling parts of the query object before we reach the getAllTours handler.
  // And as soon as we get to the 'getAllTours' function, the query object is already prefilled
  // we prefilled the query string, so that the user doesn't have to do it on its own
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      // all of these chaining here works because after calling each of these methods we always return 'this', and 'this' is the object itself which has access to each of these methods
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // we keep adding stuff to the query until the end
    // then by the end, by the end, we await the result of that query, so that it can come back with all the documents that were selected. That query now lives in 'features', which is this object
    const tours = await features.query;

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
    await Tour.findByIdAndDelete(req.params.id);
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // 102. Aggregation Pipeline: Matching and Grouping
      // 'find' returns a query, 'aggregate' returns an aggregate object. And then only when wee await it, it comes back with the result
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // mongoDB works this way (objects inside objects, inside objects)
          // _id: '$ratingsAverage',
          // _id: '$difficulty',
          _id: { $toUpper: '$difficulty'},
          numTours: {$sum: 1},
          numRatings: {$sum: 'ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' }, // $avg - is a math operator calculating the average
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 } // 1 - for ascending
      },
      // {
      //   // we can match different times
      //   $match: { _id: { $ne: 'EASY'}} // $ne = not equal // we exclude all the documents that are easy
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
