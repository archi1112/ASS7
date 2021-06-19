// import statements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import file from utilities
const HttpError = require('./utils/http-error');

// import file from routes
const userroutes = require('./routes/user-routes');
const adminroutes = require('./routes/admin-routes');

// configuration statements
const port = 3002;
const localhost = '127.0.0.1'
app.use(bodyParser.json());

// routing
app.use("/api/v1/user",userroutes);
app.use("/api/v2/admin",adminroutes);

//creating custom error
app.use((req,res,next) =>{
  const error = new HttpError("page not found",404);
  throw error;
});

app.use((error,req,res,next) => {
    res.status(error.code);
    res.json({message:error.message || "An unknown error occured",code:error.code})
  })
  
  // attatching database 
  mongoose.connect('mongodb+srv://archi_1112:archi11122001@mern-stack.dhdmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }).then(() => {
    app.listen(port, () => {
      console.log(`App running on http://localhost:${port}`)
    });
  }).catch(err => {
    console.log(err);
  });
  
  
  