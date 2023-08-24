const mongoose = require("mongoose");
const { timeStamp } = require("node:console");
const fs = require("node:fs");
const slot = require("./subModels/Slot");

const StadiumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    owner: {
      required: true,
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // unique: [true,'duplicate article title'],
      // required: [true, 'Please add a title']
    },
    assets: {
      type: [String],
    },

    createdAt: {
      type: Date,

      default: Date.now,
    },

    position: {
      type: {
        type: String,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    location: {
      type: String,

      required: true,
    },

    description: {
      type: String,

      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

StadiumSchema.virtual("matches", {
  ref: "Match",
  localField: "_id",
  foreignField: "stadium",
  justOne: false,
});

StadiumSchema.index({ position: "2dsphere" });

module.exports = mongoose.model("Stadium", StadiumSchema);
