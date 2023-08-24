const User = require("../../models/User");
const asyncHandler = require("../../middlewares/async");
const errorResponse = require("../../utils/error");
const path = require("path");

//@des     register new user
//@route   POST :'api/v1/auth/register'
//@access   'public'

exports.register = asyncHandler(async (req, res, next) => {
  const registerData = await User.create(req.body);

  getTokenResponse(registerData, 201, res);
});

//@des     log user
//@route   POST :'api/v1/auth/login'
//@access   'public'

//handle user login
exports.login = asyncHandler(async (req, res, next) => {
  //get login credentials
  const { phone, password, username } = req.body;

  if (!phone || !password) {
    return next(new errorResponse("Please add your password and phone", 400));
  }

  //get user with password
  const user = await User.findOne({ phone }).select("+password");

  //check if user exist (email validation)
  if (!user) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //password validation
  const isMatched = await user.checkPassword(password);

  if (!isMatched) {
    return next(new errorResponse("Invalid credentials", 401));
  }

  //generate  token and send responsw
  getTokenResponse(user, 200, res);
});

const getTokenResponse = (user, status, res) => {
  //generate  token and send responsw
  const token = user.getSignedJwt();

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

//@des     get current user
//@route   POST :'api/v1/auth/me'
//@access   'private'

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "reviews",
    populate: {
      path: ("reviewer", "matchId"),
    },
  });
  //password validation
  //password validation

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@des     check if username exist
//@route   POST :'api/v1/auth/username'
//@access   'private'

exports.checkUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  console.log(user);
  if (user) {
    return next(new errorResponse("username exist", 401));
  }

  res.status(200).json({
    success: true,
  });
});

//@des      update user
//@route   PUT :'api/v1/auth/update'
//@access   'private'

exports.updateUser = asyncHandler(async (req, res, next) => {
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

      photo.name = `photo_${Date.now}_${req.user.id}${path.extname(
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

  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
