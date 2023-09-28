const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router()

router
  .route('/') // new one
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;  