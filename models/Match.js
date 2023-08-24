const mongoose = require("mongoose");
// const fs = require('node:fs');
const slot = require("./subModels/Slot");


const MatchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "match",
      // unique: [true,'duplicate article title'],
      // required: [true, 'Please add a title']
    },

    booker: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    players: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    code: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },

    stadium: { type: mongoose.Schema.ObjectId, ref: "Stadium", required: true },

    gameHours: {
      type: Number,
      default: 1,
    },
    timeRange: {
      type: slot.schema,
      required: true,
      default: () => {
        return slot({ start: new Date(), finish: new Date(), state: false });
      },
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
    playersNum: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,

      required: true,
    },
    private: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,

      default: Date.now,
    },
    status: {
      type: String,
      default: "created",
      enum: ["created", "start", "end"],
    },

    // location: {
    //   type: String,

    //   required: true,
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MatchSchema.index({ position: "2dsphere" });

module.exports = mongoose.model("Match", MatchSchema);
