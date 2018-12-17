const express = require('express');
const errors = require('restify-errors');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require("../config");
const auth = require("../models/auth");

router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body;
    const userEmailAlreadyExist = await User.findOne({ email });
    if (userEmailAlreadyExist !== null) {
      return res.status(400).send('User already registerd')
    }
    const user = new User({
      email,
      password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        user.password = hash;

        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(errors.InternalError(err.message));
        }
      });
    });
  });

  router.post('/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await auth.authenticate(email, password);
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m" 
      });
      res.send({ token });
      next();
    } catch (err) {
      return next(new errors.UnauthorizedError(err));
    }
  });

  router.get('/me',async (req, res, next) => {
    try {
      const user = await User.find();
      res.send(user);
      next();
    } catch (err) {
        return res.status(400).send('No User Found')
    }
  });


  
module.exports = router;