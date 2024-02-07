// import model
const Post= require("../models/postModel")
const Like=require("../models/likeModel");
exports.likePost=async(req,res)=>{
    try{
         const{post,user}=req.body;
         const like=new Like({post,user});
         const savedLike= await like.save();

        //  adding the above new like in Post model
        const updatedPost=await Post.findByIdAndUpdate(post,{$push:{likes: savedLike._id}},{new: true})
           .populate("likes")
           .exec();
           res.json({
           post: updatedPost,
           })
    }
    catch(error)
    {
        console.log("error is = "+error);
        return res.status(500).json({
            error:"Error while liking a post",
            error:error.msg,
        })
    }
}

// unlike a Post
exports.unlikePost=async(req,res)=>
{
    try{
         const{post,like}=req.body;//Post model ke andr ka "likes" field and Like  model ke andr ja "post" field 
        // ko fetch krr rhe hai pahle kyuki oose delete krna hai 
          const deletedLike=await Like.findOneAndDelete({post:post,_id:like})//delete the like
            const updatedPost=await Post.findByIdAndUpdate(post,{$pull:{likes:deletedLike._id}},{new:true})       //   update the Post  collection or document
            // "Like" document or model ke andr ke "post" field ke andr ke id ke help se we will find "Post" document and "Post" document "likes" field ke andr se we will pull or delete the id of "Like" document which we have unliked 

            res.json({
                post:updatedPost
            })
        }    
    catch(error)
    {
        console.log("error is = "+error);
        return res.status(500).json({
            error:"Error while unliking a Post",
            error:error.msg
    })
    }
}




exports.dummyLink=(req,res)=>
{
    res.send("This is your dummy Page");
}