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
        type:mongoose.Schema.type.ObjectId,
        ref:"Comment",
    }
   
})

// exports
exports.module=mongoose.model("Post",postSchema);