const dotenv= require('dotenv');
const express = require('express');
const dbConnect= require('./config/dbConnect');
const cors = require('cors');
const fileUpload=require('express-fileupload');
const path=require('path');
const morgan = require("morgan");
const colors= require('colors');
const errorHandler=require('./middlewares/errorHandler')

const authRoute=require('./routes/Auth/authR');
const reviewerRoute=require('./routes/reviewerR');
const matchRoute=require('./routes/matchR');
const reviewRoute=require('./routes/reviewR')
const revAuthR=require('./routes/Auth/revAuthR');
const stadiumRoute=mRoute=require('./routes/stadium');

// const errorHandler=require('./middlewares/errorHandler')

const app = express();

dotenv.config({path:'./config/config.env'});

app.use(morgan("dev"));

app.use(express.json({ limit: "50mb" }));

app.use(fileUpload());

app.use(express.static(path.join(__dirname,'public')));



//connect with the database

dbConnect();


//routes

// app.use("/api/v1/doctor",doctorRoute);
app.use("/api/v1/stadium",stadiumRoute);
app.use("/api/v1/match",matchRoute);
app.use("/api/v1/review",reviewRoute);
app.use("/api/v1/reviewer",reviewerRoute);



app.use('/api/v1/auth',authRoute);


// app.use("/api/v1/homeCare",homeCareRoute);
app.use('/api/v1/authR',revAuthR);
// app.use('/api/v1/ad',adRoute);






// error handler middleware

// app.use(errorHandler);



app.use(errorHandler);

  
//listing
const PORT= process.env.PORT||3000
const server= app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`.green);

},'0.0.0.0');

// handeling unhandle promise
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
  
    //close the application
    server.close(() => {
      process.exit(1);
    });
  });