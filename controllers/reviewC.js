
const Review = require("../models/Review");
const ErrorResponse = require("../utils/error");
const asyncHandler = require("../middlewares/async");
const path = require("path");




//@des     get all Reviewes
//@route   get :'api/v1/Reviewe'
// //@access   'public'
exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find();

  if (!reviews) {
    return next(new ErrorResponse("resourse not found", 404));
  }

    res.status(200).json(res.advanceResults);
  // res.status(200).json({ success: true, data: Reviewes });
});





//@des     get one Review by id
//@route   get :'api/v1/Review'
//@access   'public'
exports.getReview = asyncHandler(async (req, res, next) => {


  const review = await Review.findById(req.params.id);


  console.log(review);

  if (!review) {
    return next(new ErrorResponse("Review not found", 404));
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});





//@des     create a Review review
//@route   POST :'api/v1/Review'
//@access   'private'
exports.createReview = asyncHandler(async (req, res, next) => {

  req.body.reviewer = req.user.id;
  console.log(req.files);
                                                         
    

    const data = await Review.create(req.body);

    res.status(201).json({
      sucess: true,
      data: data,
    });

});





// //@des     update a Review using its id
// //@route   PUT :'api/v1/Review'
// //@access   'private'
// exports.UpdateReview = asyncHandler(async (req, res, next) => {
//   const Review = await Review.findById(req.params.id);
//   if (!Review) {
//     return next(
//       new ErrorResponse(404, `Review not found with the id : ${req.params.id}`)
//     );
//   }

//   if (req.user.role !== "user") {
//     return next(
//       new ErrorResponse(
//         `wrong user, not authorized to update this resource`,
//         403
//       )
//     );
//   }

  
//   const data = await Review.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: false,

//   });

  
//   if(!data){
//     return next(
//       new ErrorResponse(" Review has not been updated", 500)
//     );      
//   }


//   res.status(200).json({
//     sucess: true,
//     data: data,
//   });




// });




//@des     delete a REVIEW using its id
//@route   delete :'api/v1/review'
//@access   'private'
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(404, `Review not found with the id : ${req.params.id}`)
    );
  }
  console.log(req.role);
  // if (  req.body.reviewer !== req.user.id
  //   ) {
  //   return next(
  //     new ErrorResponse(
  //       `wrong reviewer, not authorized to update this resource`,
  //       403
  //     )
  //   );
  // }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    sucess: true,
    data: [],
  });
});




//@des     update a review using its id
//@route   PUT :'api/v1/review'
//@access   'private'
exports.UpdateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(404, `Review not found with the id : ${req.params.id}`)
    );
  }

  if (  req.body.reviewer !== req.user.id
    ) {
    return next(
      new ErrorResponse(
        `wrong reviewer, not authorized to update this resource`,
        403
      )
    );
  }

  const data = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false,
  });

  if (!data) {
    return next(new ErrorResponse(" Review has not been updated", 500));
  }

  res.status(200).json({
    sucess: true,
    data: data,
  });
});