
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


const dbConnect = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {


   
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
    
  });
  console.log(
    `mongo db connection :${conn.connection.host}`.blue.underline.bold
  );

  
};
module.exports = dbConnect;
