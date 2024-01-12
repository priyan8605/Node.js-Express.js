//import model
const Post=require("../models/postModel");
const Comment=require("../models/commentModel");
const Like=require("../models/likeModel");

exports. createComment=async(req,res)=>
{//here we have to create comment
    //for create we will make object and with save() we inserst in an object
    try{
        //   fetch data from request body
        const {post,user,body}=req.body;
        //create a comment object
        const comment=new Comment({post,user,body});
        //save or insert the comment object into database
        const savedComment=await comment.save();

        // adding new comment in post
        //1st find post using id on which new comment has been done
        //2nd add the new comment in the post's "comment" array
           const updatedPost=new Post.findByIdAndUpdate(post,{$push:{comments:savedComment._id}},{new:true}); //Post ko find krenge through Id and oos Post ke comment array me new
          //"post" of Comment model ke id ke help se "Post" model find kroo and "Post" model ke "comment" array me "saved comment" ka _id update krr do
          //{new:true} iske wajah update document jisme new comment hai that will return agr ye nhi krenge to hmare document me new comment jo ki update hua hai that wond be shown
           //$push is an operator for updating 
           //$pull is an operator for deleting
           //new comment daal krr update krr denge

    }
    catch(err)
    {

    }
}