const mongoose = require("mongoose");
const points = require("./subModels/Points");

const ReviewSchema = new mongoose.Schema({
  point: {
    type: points.schema,
    required: true,
  },
  matchId: {
    type: mongoose.Schema.ObjectId,
    ref: "Match",
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: "Reviewer",
    required: true,
  },
  playerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

ReviewSchema.statics.getAverageRating = async function (player) {
  const obj = await this.aggregate([
    {
      $match: { playerId: player },
    },
    {
      $group: {
        _id: "$player",
        attack: { $avg: "$point.attack" },
        defense: { $avg: "$point.defence" },
        speed: { $avg: "$point.speed" },
        control: { $avg: "$point.control" },
      },
    },
  ]);

  try {
    await this.model("User").findByIdAndUpdate(player, {
      points: {
        attack: Math.round(obj[0].attack),
        defence: Math.round(obj[0].defense),
        speed: Math.round(obj[0].speed),
        control: Math.round(obj[0].control),
      },
    });
  } catch (err) {}
};

ReviewSchema.post("save", async function (net) {
  this.constructor.getAverageRating(this.playerId);
});

ReviewSchema.pre("remove", async function () {
  this.constructor.getAverageRating(this.playerId);
});

module.exports = mongoose.model("Review", ReviewSchema);
