const { json } = require("express");
const errorResponse= require('../utils/error')

const errorHandler=(err,req,res,next)=>{

let error={...err};

error.message=err.message;


//mongoose validation error

if(err.name==='ValidationError'){

    //smart piece of code
  const message=Object.values(err.errors).map(value => value.message);
  
  error=new errorResponse(message,400);
  
  
  }

  //handle duplicated values error
if(err.code===11000){
const message ='Duplicated value entered'
error = new errorResponse(message,400)



}
console.log(err)
//handle mongodb  id object cast error
if(err.name==='CastError'){
  const message=`incorrect id object `
error =  new errorResponse(message,404);

}

res.status(error.statusCode||500).json({
    success:false,
    errorMessage:error.message||err.message
});


}

module.exports= errorHandler;
