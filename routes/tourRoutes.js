const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router()

router.route('/top-5-cheap') // 127.0.0.1:3000/api/v1/tours/top-5-cheap
// we have to put the 'tours', because we are in the tours resource and the whole router is mounted onto this tours route, and its in the 'tours' that we created the 'top-5-cheap'
  .get(tourController.aliasTopTours, tourController.getAllTours)

router
  .route('/') 
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;  
