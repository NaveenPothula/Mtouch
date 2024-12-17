const crypto = require('crypto');
const mongoose = require('mongoose');
//const validator = require('validator');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
   // validate: [validator.isEmail, 'Please provide a valid email'],
    lowercase: true,
  },

  age: {
    type: Number,
   required: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  class: {
    type: String,
    required: true
  },
  section:{
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  }
,
photo: {
    type: String
}
}, {
    timestamps: true
  }
  );


studentSchema.pre('save', async function (next) {
  
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

 
  this.confirmPassword = undefined;
  next();
});


studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const Student = mongoose.model('User', studentSchema);

module.exports = Student;
9703010155