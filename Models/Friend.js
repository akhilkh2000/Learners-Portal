const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/* Users Table/Schema Starts*/
const friendSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  mentorId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  mentorName: {
    type: String,
    required: true,
  },

  status:{
      type:String,
      required:true,
      default:"requested"
  },
  messages:{
      type:[{text:String,sender:String,time:{type:Date,default:new Date()}}],
      default:[]
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

//Creating the Schema/Table in Database
const Friend = mongoose.model("Friend", friendSchema);

//   Validating the User
function validateFriend(user) {
  const schema = {
    studentName: Joi.string().min(2).max(32).required(),
    mentorName: Joi.string().min(2).max(32).required(),
    studentId: Joi.string().min(2).max(32).required(),
    mentorId: Joi.string().min(2).max(32).required(),
    status: Joi.string().min(2).max(32).required(),
  };
  return Joi.validate(user, schema);
}


exports.Friend = Friend;
exports.validate = validateFriend;
