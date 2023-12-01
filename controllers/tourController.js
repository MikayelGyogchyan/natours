const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      
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
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty'},
          numTours: {$sum: 1}, // for each document we add 1
          numRatings: {$sum: 'ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' }, 
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 } 
      },
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

// 103. Aggregation Pipeline: Unwinding and Projecting

exports.getMonthlyPlan = async (req, res) => { // 127.0.0.1:3000/api/v1/tours/monthly-plan/2021
  try{
    const year = req.params.year * 1 

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`), 
            $lte: new Date(`${year}-12-31`), // to be between the first day of the day of the year and the last day of the current year 
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // grouping by the date
          numTourStarts: { $sum: 1}, // counting the amount of tours that have a certain month // $sum: 1 - for each document we add 1
          tours: {$push: '$name'} // we create an array. And we do that using '$push'. As each doc goes through this pipeline, '$name' is the name of the field, in this case the name of the tour
        }
      },
      {
        $addFields: { month: '$_id'} // the name that we want to add or the field is called 'month', and it has the value of the field with the name '_id'. Simply the name of the field: the value
      },
      {
        $project: {
          _id: 0 // we give each of the field names a 0 or a 1. 0 will make the _id no longer shows up. 1 will show up
        }
      },
      {
        $sort: { numTourStarts: -1 } // -1 - descending
      },
      {
        $limit: 12 // this allows us to have only 12 docs/outputs
      }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
}
