const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/Student.js');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
  
  const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
  
    
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
      httpOnly: true,
    };
  
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  };
  

  exports.signup = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const newuser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      section: req.body.section,
      rollNumber: req.body.rollNumber,
      class: req.body.class

    });
  
   
  
    createSendToken(newuser, 201, res);
  });


  exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
 
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
  
    
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email and password!', 401));
    }
  
   
    createSendToken(user, 200, res);
  });

  exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
  
    res.status(200).json({
      status: 'success',
    });
  };


  exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      
    }
  
    if (!token) {
      return next(
        new AppError('You are not logged in. Please log in to get access', 401),
      );
    }
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401,
        ),
      );
    }


  
    
   
    req.user = currentUser;
    
  
   
    next();
  });
  

  exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      // roles ['admin','lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action', 403),
        );
      }
  
      next();
    };
  };
  
  