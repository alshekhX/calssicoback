const express = require("express");

const {
  register,
  login,
  getMe,
  updateReviewer,
  checkReviewerUsername,
} = require("../../controllers/Auth/RevAuthC");
const { reviewProtect } = require("../../middlewares/protect");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").post(reviewProtect, getMe);


module.exports = router;
