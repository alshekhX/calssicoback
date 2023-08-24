const Reviewer = require("../models/Reviewer");
const ErrorResponse = require("../utils/error");
const asyncHandler = require("../middlewares/async");
const path = require("path");


//@des     get all Reviewers
//@route   get :'api/v1/Reviewer'
//@access   'public'
exports.getReviewers = asyncHandler(async (req, res, next) => {
  const Reviewers = await Reviewer.find();

  if (!Reviewers) {
    return next(new ErrorResponse("resourse not found", 404));
  }

  res.status(200).json(res.advanceResults);
  // res.status(200).json({ success: true, data: Reviewers });
});

//@des     get one Reviewer by id
//@route   get :'api/v1/Reviewer'
//@access   'public'
exports.getReviewer = asyncHandler(async (req, res, next) => {
  const reviewer = await Reviewer.findById(req.params.id);

  console.log(reviewer);

  if (!reviewer) {
    return next(new ErrorResponse("Reviewer not found", 404));
  }

  res.status(200).json({
    success: true,
    data: reviewer,
  });
});

//@des     create a Reviewer
//@route   POST :'api/v1/Reviewer'
//@access   'private'
exports.createReviewer = asyncHandler(async (req, res, next) => {

req.body.reviewer
  
        //give the image file a costume name so it wont be duplicated in the database and overwritting
       
    const data = await Reviewer.create(req.body);



    res.status(201).json({
      sucess: true,
      data: data,
    });

});


//@des     update an Reviewer using its id
//@route   PUT :'api/v1/Reviewer'
//@access   'private'
exports.UpdateReviewer = asyncHandler(async (req, res, next) => {
  const reviewer = await Reviewer.findById(req.params.id);

  if (!reviewer) {
    return next(
      new ErrorResponse(404, `Reviewer not found with the id : ${req.params.id}`)
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

    req.body.photo = assetsDatabase[0];
  }

  const data = await Reviewer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  res.status(200).json({
    sucess: true,
    data: data,
  });
});



//@des     delete an Reviewer using its id
//@route   delete :'api/v1/Reviewer'
//@access   'private'
exports.deleteReviewer = asyncHandler(async (req, res, next) => {
  const reviewer = await Reviewer.findById(req.params.id);

  if (!reviewer) {
    return next(
      new ErrorResponse(404, `Reviewer not found with the id : ${reviewer}`)
    );
  }
  console.log(req.role);
  //change user to admin
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `wrong user, not authorized to delete this resource`,
        403
      )
    );
  }

  await Reviewer.findByIdAndDelete(req.params.id);

  res.status(200).json({
    sucess: true,
    data: [],
  });
});
