const express = require("express");
const Review = require("../models/Review");

const { reviewProtect, authorize } = require("../middlewares/protect");

const {
  getReviews,
  UpdateReview,
  deleteReview,
  getReview,
  createReview,
} = require("../controllers/reviewC");
const advanceResults = require("../middlewares/advanceResults");

const router = express.Router();

router.route("/").get(advanceResults(Review), getReviews);
router.route("/").post(reviewProtect, createReview);
router
  .route("/:id")
  .put(reviewProtect, UpdateReview)
  .get(getReview)
  .delete(reviewProtect, deleteReview);


module.exports = router;
