const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/Student');

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };

  
  exports.updateUser = catchAsync(async (req, res, next) => {
  
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  });
  

  exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  exports.getUser = catchAsync(async (req, res, next) => {
    console.log(req.params.id)
    const user=await User.findById(req.params.id)
    console.log(user)
    res.status(204).json({
      status: 'success',
      data: {
        user: user
      },
    });
  });
exports.getAllUsers = catchAsync(async(req,res,next)=>{

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit), 
        User.countDocuments() 
      ]);
  
     
      const totalPages = Math.ceil(total / limit);
  
 
      res.status(200).json({
        success: true,
        data: {
            users: users
        },
        meta: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          pageSize: limit,
        },
      });
  

   
})

exports.createUser = catchAsync(async(req,res,next)=>{
    const newuser = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          age: req.body.age,
          section: req.body.section,
          rollNumber: req.body.rollNumber,
          class: req.body.class,
          photo: req?.file?.path

    
        });

        res.status(200).json({
            status: "Success",
            data: {
                user: newuser
                }       
        })
      
})