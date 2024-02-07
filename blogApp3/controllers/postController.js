// yha 2 kaam krni hai
//1> ek to creaTE krni hai post aur
//2> doosri fetch krni hai post
const Post=require("../models/postModel")
exports.createPost=async(req,res)=>
{

     try{

    const {title,body}=req.body;//fetch data "title,body" from request body

     const post=new Post({title,body});//creating a "post" object

      const savedPost=await post.save();//save the post

      res.json({
        post:savedPost
      })

    }
    catch(error)
    {
        return res.status(400).json({
          error:"Error while creating a post"
        })
    }
}

exports.getAllPosts=async(req,res)=>
{
  try{
const posts=await Post.find().populate("likes").populate("comments").exec();
// "Post" model ke andr "likes" ,"comments" field me id naa store hoke actual document store hoga
// find() will find all the document present in "Post" model
            res.json({
              posts,
            })
  }
  catch(error)
  {
      return res.status(400).json({
        error:"Error while fetching post"
      })
  }
}