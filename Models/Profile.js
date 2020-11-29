const Joi = require("joi");
const mongoose = require("mongoose");

/* Users Table/Schema Starts*/
const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  imgUrl:{
    type: String,
    default:''
  },
  regCode:{
    type:String,
    default:''
  },
  gender:{
    type:String,
    default:''
  },
  skills: {
    type: [String],
  },
  certificate: {
    type: [String],
  },
  designation: {
    type: String,
    default:"NA"
  },
  social: {
    type:[{platform:String,link:String}],
    default:[]
  },
  info: {
    type:[{title:String,value:String}],
    default:[]
  },
  ratings: {
      type:[{userId:String, reviewer:String, rating:Number, comment: String}],
      default:[]
  },
  friends: {
      type:[String]
  },
  avgRating: {
      type:Number,
      default: 0
  },
  topSearches: {
      type:[String],
      default:[],
      lowercase:true
  },
  role:{
      type:String,
      lowercase:true,
      required:true
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});


profileSchema.methods.getAvgRating = function () {
    if(this.ratings.length==0) return 0;
    let avg=0;
    this.ratings.forEach(el=>{
        avg = avg + el.rating;
    });
    let score=avg/this.ratings.length;
    return Math.round(score * 10) / 10 ;
  };


//Creating the Schema/Table in Database
const Profile = mongoose.model("Profile", profileSchema);


exports.Profile = Profile;
