//import mongoose
const mongoose=require('mongoose');

// route handler
const likeSchema=new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,//stores the id of "Post" model
        ref:"Post",//refering to "Post" model for id
    },
    user:{
        type:String,
        required:true
    }
})

// export
const Like=mongoose.model("Like",likeSchema);
module.exports=Like;
//exports.module=mongoose.model("Like",likeSchema);