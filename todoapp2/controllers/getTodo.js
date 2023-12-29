const Todo=require("../models/Todo");
const getTodo=async(req,res)=>{
    try{
    //    fetch all todo items from database
    const todos=await Todo.find({});//bcoz of find({}) all the data present Todo will be fetched

    res.status(200).json(
        {
             //body of json
             success:true,
             data:todos,//data ke andr sare ke sare todos items daal rhe hai
             message:'Entire Todo data is fetched'
        }

    )
    }
    catch(err)
    {
        console.error(err);
        console.log(err);
        res.status(500).json({
         success:false,
         data:" server error",
         message:err.message,
        })
    }
}
  module.exports={getTodo};