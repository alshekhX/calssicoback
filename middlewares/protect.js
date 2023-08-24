const asyncHandler= require('./async');
const errorResponse=require('../utils/error');
const User = require('../models/User');
const jwt= require('jsonwebtoken');
const Reviewer = require('../models/Reviewer');





//routes protection
exports.protect=asyncHandler(async(req,res,next)=>{
    let token;
//check token in the header
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){

token=req.headers.authorization.split(' ')[1];


    }

    //check if the token exist
if(!token){

    return next(new errorResponse('not authorized to access',401));
}


//decode token
//TODO
try{

const decoded=jwt.verify(token, process.env.JWT_SECERT);
req.user = await User.findById(decoded._id);
console.log(decoded._id);
next();

}
catch(err){

    return next(new errorResponse('not authorized to access',401));


}



    // else if(req.cookies.token){
    //     token=req.cookies.token

    // }



});




//routes protection
exports.reviewProtect=asyncHandler(async(req,res,next)=>{
    let token;
//check token in the header
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){

token=req.headers.authorization.split(' ')[1];


    }

    //check if the token exist
if(!token){

    return next(new errorResponse('not authorized to access',401));
}


//decode token
//TODO
try{

const decoded=jwt.verify(token, process.env.JWT_SECERT);
req.user = await Reviewer.findById(decoded._id);
console.log(decoded._id);
next();

}
catch(err){

    return next(new errorResponse('not authorized to access',401));


}



    // else if(req.cookies.token){
    //     token=req.cookies.token

    // }



});

//role authorization, grant access to specific role
exports.authorize=(...role)=>{

return (req,res,next)=>{
    if(!role.includes(req.user.role)){
        return next(new errorResponse(`the role ${req.user.role} is not authorized to access this route`  ,403));

    }


next();
}


}