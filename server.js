const express=require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require("./config");
const users = require('./routes/users');
const app=express()

  app.use(morgan('dev'))
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.json());

  app.use('/api/users',users);

  app.get('/checking', function(req, res){
    res.json({
       "Test": "Welcome to Jwt Node Js"
    });
 });

 app.listen(config.PORT,()=>{
    mongoose.set('useFindAndModify', false);
    mongoose.connect( config.MONGODB_URI,
        { useNewUrlParser: true }
        );
    });

const db = mongoose.connection;
db.on("error", err => console.log(err));

console.log(`Server run in port ${config.PORT}..`);