const Match = require("../models/Match");
const ErrorResponse = require("../utils/error");
const asyncHandler = require("../middlewares/async");
const path = require("path");
const {checkStadiumAvail}= require('./stadiumC')

const User = require("../models/User");
const CodeGenerator = require("../utils/RandCodeGenerator");
const slot = require("../models/subModels/Slot");
const moment = require("moment");
const { match } = require("assert");
const { createDecipheriv } = require("crypto");

//@des     get all matches
//@route   get :'api/v1/match'
//@access   'public'
exports.getMatchs = asyncHandler(async (req, res, next) => {
  // const matches = await Match.find().populate('stadium');
  // console.log(matches);

  // if (!matches) {
  //   return next(new ErrorResponse("resourse not found", 404));
  // }

  res.status(200).json(res.advanceResults);
});

//@des     get one match by id
//@route   get :'api/v1/match'
//@access   'public'
exports.getMatch = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id).populate('stadium');

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  res.status(200).json({
    success: true,
    data: match,
  });
});

//@des     create a match
//@route   POST :'api/v1/match'
//@access   'private'
exports.createMatch = asyncHandler(async (req, res, next) => {

  await checkStadiumAvail(req, res, next);
  req.body.booker = req.user.id;
  const finishDate = moment(new Date()).add(req.body.gameHours, "hours");
  req.body.timeRange = slot({
    start: req.body.start,
    finish: finishDate,
    state: false,
  });

  //check if the creater of the match is playing
  if (req.body.join) {
    if (req.body.join == true) req.body.players = [req.user.id];
  }

  req.body.code = await CodeGenerator.generateUniqueRandomString(5);
  console.log(req.body);

  const data = await Match.create(req.body);

  res.status(201).json({
    sucess: true,
    data: data,
  });
});

//@des     join a match with code
//@route   POST :'api/v1/match/join/code'
//@access   'private'
exports.joinMatchCode = asyncHandler(async (req, res, next) => {
  const match = await Match.findOne({
    code: req.body.code,
  });

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  if (match.players.length >= match.playersNum) {
    return next(new ErrorResponse("match is already full", 404));
  }

  if (match.status != "created") {
    return next(new ErrorResponse("match not available or finished", 404));
  }

  const data = await Match.updateOne(
    {
      code: req.body.code,
    },
    {
      $addToSet: { players: [req.user.id] },
    },
    {
      new: true,
      runValidators: false,
    }
  );

  res.status(201).json({
    sucess: true,
    data: data,
  });
});

//@des     join a match with id
//@route   POST :'api/v1/match/join/:id'
//@access   'private'
exports.joinMatch = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  if (!match.private == false) {
    return next(new ErrorResponse("match is private", 403));
  }

  if (match.players.length >= match.playersNum) {
    return next(new ErrorResponse("match is already full", 404));
  }

  if (match.status != "created") {
    return next(new ErrorResponse("match not available or finished", 404));
  }

console.log(req.user.id);
console.log(match.players)


  
if(match.players.includes(req.user.id)){

  return res.status(409).json({
    sucess: false,
  });}

  const data = await Match.findByIdAndUpdate(
    req.params.id,

    {
      $addToSet: { 'players': [req.user.id] },
    },
    {
      new: true,
      runValidators: false,
    }
  ).populate('stadium');






  


  res.status(200).json({
    sucess: true,
    data: data,
  });
});

//@des     update a match using its id
//@route   PUT :'api/v1/match'
//@access   'private'
exports.UpdateMatch = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  if (!match) {
    return next(
      new ErrorResponse(404, `match not found with the id : ${req.params.id}`)
    );
  }

  if (req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `wrong user, not authorized to update this resource`,
        403
      )
    );
  }

  const data = await Match.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!data) {
    return next(new ErrorResponse(" Match has not been updated", 500));
  }

  res.status(200).json({
    sucess: true,
    data: data,
  });
});

//@des     delete a match using its id
//@route   delete :'api/v1/match'
//@access   'private'
exports.deleteMatch = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);

  if (!match) {
    return next(
      new ErrorResponse(404, `match not found with the id : ${req.params.id}`)
    );
  }
  console.log(req.role);
  if (req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `wrong user, not authorized to delete this resource`,
        403
      )
    );
  }

  await Match.findByIdAndDelete(req.params.id);

  res.status(200).json({
    sucess: true,
    data: [],
  });
});

//@des     get near match by
//@route   get :'api/v1/match'
//@access   'private'
exports.getNearMatch = asyncHandler(async (req, res, next) => {
  const matchs = await Match.aggregate([
    {
      $geoNear: {
        $maxDistance: 10,

        $geometry: {
          type: "Point",
          coordinates: [28.016344, 14.093957],
        },
        distanceField: "distance",
        distanceMultiplier: 0.001,
        spherical: true,
      },
    },
  ]);

  if (!matchs) {
    return next(new ErrorResponse("match not found", 404));
  }

  res.status(200).json({
    success: true,
    count: matchs.length,

    data: matchs,
  });
});

//@des     add a player
//@route   put :'api/v1/match/add'
//@access   'private'
exports.addPlayer = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  console.log(match);

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  if (match.booker != req.user.id) {
    return next(new ErrorResponse("you are not the match booker", 403));
  }

  if (match.players.length >= match.playersNum) {
    return next(new ErrorResponse("match is already full", 404));
  }

  if (match.status != "created") {
    return next(new ErrorResponse("match not available or finished", 404));
  }

  if (!req.body.player) {
    return next(new ErrorResponse("add a player", 404));
  }

  const data = await Match.findByIdAndUpdate(req.params.id, {
    $addToSet: { players: [req.body.player] },
  });

  res.status(201).json({
    sucess: true,
    data: data,
  });
});

//@des     add a match by
//@route   get :'api/v1/match'
//@access   'private'
exports.removePlayer = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  console.log(match);

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  if (match.booker != req.user.id) {
    return next(new ErrorResponse("you are not the match booker", 403));
  }

  if (match.players.length >= match.playersNum) {
    return next(new ErrorResponse("match is already full", 404));
  }

  if (match.status != "created") {
    return next(new ErrorResponse("match not available or finished", 404));
  }

  if (!req.body.player) {
    return next(new ErrorResponse("add a player", 404));
  }

  const data = await Match.findByIdAndUpdate(req.params.id, {
    $pull: { players: req.body.player },
  });

  res.status(200).json({
    sucess: true,
    data: data,
  });
});


//@des     add a match by
//@route   get :'api/v1/match'
//@access   'private'
exports.exitMatch = asyncHandler(async (req, res, next) => {
  const match = await Match.findById(req.params.id);
  console.log(match);

  if (!match) {
    return next(new ErrorResponse("match not found", 404));
  }

  if (match.status != "created") {
    return next(new ErrorResponse("match not available or finished", 404));
  }

  const data = await Match.findByIdAndUpdate(req.params.id, {
    $pull: { players: req.user.id },
  });

  res.status(200).json({
    sucess: true,
    data: data,
  });
});
