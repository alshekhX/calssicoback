const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Point = require("./subModels/Points");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    phone: {
      required: true,
      type: String,
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
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: 6,
      select: false,
    },
    // reviews:{
    //     type:[review],
    //     default:[]
    // },

    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },

    points: {
      type: Point.schema,
      default: () => {
        return Point({ attack: 50, defence: 50, speed: 50, control: 50 });
      },
    },

    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "playerId",
  justOne: false,
});

UserSchema.virtual("match", {
  ref: "Match",
  localField: "_id",
  foreignField: "booker",
  justOne: false,
});

//to avoid context error we dont use arrows functions
UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ _id: this.id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//password validation
UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//hash the password
UserSchema.pre("save", async function (next) {
  //you can check before save if a specific field get modified
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
