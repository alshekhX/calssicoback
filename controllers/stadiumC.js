const Stadium = require("../models/Stadium");
const ErrorResponse = require("../utils/error");
const asyncHandler = require("../middlewares/async");
const path = require("path");
const User = require("../models/User");



const momment = require("moment");
// const date = require("date-and-time");
//@des     get all Stadiums
//@route   get :'api/v1/Stadium'
//@access   'public'
exports.getStadiums = asyncHandler(async (req, res, next) => {
  const Stadiums = await Stadium.find();

  if (!Stadiums) {
    return next(new ErrorResponse("resourse not found", 404));
  }

  res.status(200).json(res.advanceResults);
  // res.status(200).json({ success: true, data: Stadiums });
});

//@des     get one Stadium by id
//@route   get :'api/v1/Stadium'
//@access   'public'
exports.getStadium = asyncHandler(async (req, res, next) => {
  const stadium = await Stadium.findById(req.params.id);

  console.log(stadium);

  if (!stadium) {
    return next(new ErrorResponse("Stadium not found", 404));
  }

  res.status(200).json({
    success: true,
    data: stadium,
  });
});

//@des     create a Stadium
//@route   POST :'api/v1/Stadiums'
//@access   'private'
exports.createStadium = asyncHandler(async (req, res, next) => {
  req.body.owner = req.user.id;

  if (req.files != null) {
    console.log(req.files.assets);

    if (req.files.assets != null) {
      var theAssets = [];

      if (Array.isArray(req.files.assets) == false) {
        theAssets.push(req.files.assets);
      }

      if (Array.isArray(req.files.assets) == true) {
        theAssets.push.apply(theAssets, req.files.assets);
      }







      

      console.log(theAssets);

      var assetsDatabase = [] ;

      for (var i = 0; i < theAssets.length; i++) {
        //getting the image file
        var photo = theAssets[i];

        //make sure the file size is less than  FILE_MAX_SIZE
        if (photo.size > process.env.FILE_MAX_SIZE) {
          return next(
            new ErrorResponse("image must be less than 10 megabytes", 400)
          );
        }

        //give the image file a costume name so it wont be duplicated in the database and overwritting
        photo.name = `photo_${Date.now()}${i}_${path.parse(photo.name).ext}`;
        assetsDatabase.push(photo.name);

        photo.mv(
          `${process.env.FILE_UPLOAD_PATH}/${photo.name}`,
          async (err) => {
            if (err) {
              console.error(`${err}`.green.inverse);
              return next(
                new ErrorResponse(
                  "something went wrong with the image upload",
                  500
                )
              );
            }
          }
        );
      }
    }

    req.body.assets = assetsDatabase;

    const data = await Stadium.create(req.body);

    res.status(201).json({
      sucess: true,
      data: data,
    });
  } else {
    const data = await Stadium.create(req.body);

    res.status(201).json({
      sucess: true,
      data: data,
    });
  }
});

exports.checkStadiumAvail = asyncHandler(async (req, res, next) => {
  const stadium = await Stadium.findById(req.body.stadium).populate(
    "matches"
  );
  if (!stadium) {
    return next(new ErrorResponse("Stadium not found", 404));
  }

  const date =  req.body.start;
  const matches = stadium.matches;

  for (i = 0; i < matches.length; i++) {
    const startDate = momment(matches[i].timeRange.start);
    const finishDate = momment(matches[i].timeRange.finish);

    const gameDate = momment(date);
    const inRang = gameDate.isBetween(startDate, finishDate);
    console.log("hours :", inRang);

    if (inRang) {
      return next(new ErrorResponse("time is already booked", 404));
    }

    // if(date.getHours==begin.getHours){

    //   return next(new ErrorResponse('time is already booked', 404));
    // }
  }

});

//@des     update an Stadium using its id
//@route   PUT :'api/v1/Stadium'
//@access   'private'
exports.UpdateStadium = asyncHandler(async (req, res, next) => {
  const stadium = await Stadium.findById(req.params.id);

  if (!stadium) {
    return next(
      new ErrorResponse(404, `stadium not found with the id : ${req.params.id}`)
    );
  }

  if (req.files != null) {
    
    //image upload
    console.log(req.files.assets);

    if (req.files.assets != null) {
      var theAssets = [];

      if (Array.isArray(req.files.assets) == false) {
        theAssets.push(req.files.assets);
      }

      if (Array.isArray(req.files.assets) == true) {
        theAssets.push.apply(theAssets, req.files.assets);
      }

      console.log(theAssets);

      var assetsDatabase = [];

      for (var i = 0; i < theAssets.length; i++) {
        //getting the image file
        var photo = theAssets[i];

        //make sure that the file is image

        //make sure the file size is less than  FILE_MAX_SIZE
        if (photo.size > process.env.FILE_MAX_SIZE) {
          return next(
            new ErrorResponse("image must be less than 10 megabytes", 400)
          );
        }

        //give the image file a costume name so it wont be duplicated in the database and overwritting
        photo.name = `photo_${Date.now()}${i}_${path.parse(photo.name).ext}`;
        assetsDatabase.push(photo.name);

        photo.mv(
          `${process.env.FILE_UPLOAD_PATH}/${photo.name}`,
          async (err) => {
            if (err) {
              console.error(`${err}`.green.inverse);
              return next(
                new ErrorResponse(
                  "something went wrong with the image upload",
                  500
                )
              );
            }
          }
        );
      }
    }

    req.body.assets = assetsDatabase;
  }

  const data = await Stadium.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  res.status(200).json({
    sucess: true,
    data: data,
  });
});


//@des     delete an stadium using its id
//@route   delete :'api/v1/stadium'
//@access   'private'
exports.deleteStadium = asyncHandler(async (req, res, next) => {
  const stadium = await Stadium.findById(req.params.id);

  if (!stadium) {
    return next(
      new ErrorResponse(404, `Stadium not found with the id : ${stadium}`)
    );
  }
  console.log(req.role);
  //change user to admin
  if (req.user.role !== "user") {
    return next(
      new ErrorResponse(
        `wrong user, not authorized to delete this resource`,
        403
      )
    );
  }

  await Stadium.findByIdAndDelete(req.params.id);

  res.status(200).json({
    sucess: true,
    data: [],
  });
});
