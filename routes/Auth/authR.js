const express = require("express");
// const User=require('../models/User');

const {
  register,
  login,
  getMe,
  updateUser,
  checkUser,
} = require("../../controllers/Auth/authC");
const { protect } = require("../../middlewares/protect");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").post(checkUser);
router.route("/me").get(protect, getMe);


module.exports = router;
