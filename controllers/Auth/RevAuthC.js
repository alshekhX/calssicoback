const Reviewer = require("../../models/Reviewer");
const asyncHandler = require("../../middlewares/async");
const errorResponse = require("../../utils/error");
const path = require("path");

//@des     register new Reviewer
//@route   POST :'api/v1/auth/reviewer/register'
//@access   'public'

exports.register = asyncHandler(async (req, res, next) => {
  const registerData = await Reviewer.create(req.body);

  getTokenResponse(registerData, 201, res);
});

//@des     log Reviewer
//@route   POST :'api/v1/auth/reviewer/login'
//@access   'public'

//handle Reviewer login
exports.login = asyncHandler(async (req, res, next) => {
  //get login credentials
  const { username, password, phone } = req.body;

  if (!phone || !password) {
    return next(new errorResponse("Please add your password and phone", 400));
  }

  //get Reviewer with password
  const reviewer = await Reviewer.findOne({ phone }).select("+password");

  //check if Reviewer exist (email validation)
  if (!reviewer) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //password validation
  const isMatched = await reviewer.checkPasswordReviewer(password);

  if (!isMatched) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //generate  token and send responsw
  getTokenResponse(reviewer, 200, res);
});

const getTokenResponse = (reviewer, status, res) => {
  //generate  token and send responsw
  const token = reviewer.getSignedJwt();

  // //create cookie
  // const option = {

  //     expires: new Date(Date.now + process.nextTick.COOKIES_EXPIRES_TIME * 1000 * 60 * 60 * 24),
  //     httpOnly: true
  // }

  // if (process.env.NODE_ENV === 'production') {

  //     option.secure = true
  // }

  res.status(status).json({
    success: true,
    token,
  });
};

//@des     get current Reviewer
//@route   POST :'api/v1/auth/reviewer/me'
//@access   'private'

exports.getMe = asyncHandler(async (req, res, next) => {
  const Reviewer = await Reviewer.findById(req.Reviewer._id);
  //password validation
  //password validation

  res.status(200).json({
    success: true,
    data: Reviewer,
  });
});

//@des     check if username exist
//@route   POST :'api/v1/auth/reviewer/username'
//@access   'private'

exports.checkReviewerUsername = asyncHandler(async (req, res, next) => {
  const Reviewer = await Reviewer.findOne({ username: req.body.username });
  console.log(Reviewer);
  if (Reviewer) {
    return next(new errorResponse("username exist", 401));
  }

  res.status(200).json({
    success: true,
  });
});

//@des      update Reviewer
//@route   PUT :'api/v1/auth/reviewer/update'
//@access   'private'

exports.updateReviewer = asyncHandler(async (req, res, next) => {
  if (req.files != null) {
    if (req.files.userPhoto != null) {
      //getting the image file
      const photo = req.files.userPhoto;

      //make sure that the file is image

      //make sure the file size is less than  FILE_MAX_SIZE
      if (photo.size > process.env.FILE_MAX_SIZE) {
        return next(
          new ErrorResponse("image must be less than 10 megabytes", 400)
        );
      }

      //give the image file a costume name so it wont be duplicated in the database and overwritting
      console.log(photo);

      photo.name = `photo_${Date.now}_${req.Reviewer.id}${path.extname(
        photo.name
      )}`;
      req.body.photo = photo.name;

      photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async (err) => {
        if (err) {
          console.error(`${err}`.green.inverse);
          return next(
            new ErrorResponse("something went wrong with the image upload", 500)
          );
        }
      });
    }
  }

  const Reviewer = await Reviewer.findByIdAndUpdate(
    req.Reviewer._id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: Reviewer,
  });
});
