const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/* Users Table/Schema Starts*/
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 127,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  passwordDate: {
    type: Number,
    default: function () {
      return Math.floor(new Date().getTime() / 1000);
    },
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    required:true,
    lowercase:true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

// Method that returns JWT auth-token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
      email: this.email,
      isVerified: this.isVerified,
      gender: this.gender
    },
    config.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
// Method that returns
/* Users Table/Schema  Ends*/

//Creating the Schema/Table in Database
const User = mongoose.model("User", userSchema);

//   Validating the User
function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(32).required(),
    email: Joi.string().min(5).max(127).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().min(2).max(13).required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
