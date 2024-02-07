// import mongoose
const mongoose=require("mongoose");

// route handler
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Like",//refer to Like model
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    }
   
})

// exports
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
//exports.module=mongoose.model("Post",postSchema);