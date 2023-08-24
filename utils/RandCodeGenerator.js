const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
const Match= require('../models/Match');
const asyncHandler = require("../middlewares/async");


const randomStringGenerator = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateUniqueRandomString = asyncHandler( async(length) =>  {
  while (true) {
    const randomString = randomStringGenerator(length);
const data = await Match.findOne({ code: randomString });

    if ( data == null) {
      return randomString;
    }
  }
});

exports.generateUniqueRandomString= generateUniqueRandomString;