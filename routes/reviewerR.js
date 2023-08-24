const express = require("express");
const Reviewer = require("../models/Reviewer");

const { protect, authorize } = require("../middlewares/protect");

const {
  getReviewer,
  getReviewers,
  createReviewer,
  UpdateReviewer,
  deleteReviewer,
} = require("../controllers/ReviewerC");
const advanceResults = require("../middlewares/advanceResults");

const router = express.Router();

//redirect to comments route

router.route("/").get(advanceResults(Reviewer),protect ,authorize("admin"), getReviewers);
router.route("/").post(protect, authorize("admin"), createReviewer);
router
  .route("/:id")
  .put(protect, authorize("admin"), UpdateReviewer)
  .get(protect, getReviewer)
  .delete(protect, authorize("admin"), deleteReviewer);

module.exports = router;
