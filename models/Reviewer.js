const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ReviewerSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "first Name is required"] },
  lastname: { type: String, required: [true, "last Name is required"] },

  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "please add an email"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  photo: { type: String, default: "no_image.jpg" },

  identity: { type: String, default: "no_image.jpg" },
  phone: {
    required: true,
    type: String,
  },

  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: 6,
    select: false,
  },

  resetPasswordToken: String,

  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  description: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["approved", "pending", "blooked"],
  },
});

ReviewerSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "reviewer",
  justOne: false,
});

//to avoid context error we dont use arrows functions
ReviewerSchema.methods.getSignedJwt = function () {
  return jwt.sign({ _id: this.id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//password validation
ReviewerSchema.methods.checkPasswordReviewer = async function (
  enteredPassword
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//hash the password
ReviewerSchema.pre("save", async function (next) {
  //you can check before save if a specific field get modified
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Reviewer", ReviewerSchema);
