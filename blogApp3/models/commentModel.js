//import's mongoose instance
const mongoose=require('mongoose');

// route handler
const commentSchema=new mongoose.Schema(
    {
            post:{
             //post will store basically a type of id
             type:mongoose.Schema.Types.ObjectId,//kisi aur ke id ko refer krne ke liye use krenge
             //iske karan "type" ke andr "Post" model ke id ka reference aa jayega
             ref:"Post",//reference to the post model
             //jiskeke bhi id ko refer kiya jaa rha hai ooska name or reference likha hai
            },
            user:{
                type:String,
                required:true
            },
            body:{
                type:String,
                required:true
            }
    }
)

// export
module.exports=mongoose.model("Comment",commentSchema);//"commentSchema" ko "Comment" naam se export krr he hai

