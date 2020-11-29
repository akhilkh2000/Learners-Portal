const mongoose=require("mongoose");

const BlogSchema = new mongoose.Schema();

BlogSchema.add({
    userId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    likes:{
        type:Number,
    },
    dislikes:{
        type:Number,
    },
    reactors:{
        type:[String],
        default:[]
    }
});

const Blog = mongoose.model("Blog",BlogSchema);
module.exports=Blog;
