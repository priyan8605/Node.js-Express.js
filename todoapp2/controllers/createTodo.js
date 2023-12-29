//createTodo ka mtlb hai todo type ka object bnao aur oose database me insert kroo
// agr hum todo object bnana chahte hai to hume todo ka schema bhi pta hona chahiye
//but schema to model folder ke andr hai hence we have to import that  schema and in backend we 
//do import through require()

//import the models
 const Todo=require("../models/Todo");

//  har ek controller kisi route se link hota hai i.e har ek controller kisi path se mapped hai
//agr hum ees controller prr aaye hai mtlb definitely kisi route prr hit hue hai
// jis bhi route ke dwara hum iss controller prr pahuche hai ooske liye routeHandler likhna hoga


const createTodo=async(req,res)=>{
    try{
        const {title,description}=req.body;//extract  krega title and description from request body
        

        // createTodo wala api route todo object bnayega and oos object ke andr title and description daalega
        //aur jo object create hoga iske baad oose database me daalega(insert krega)
        const response=await Todo.create({title,description});//create() se hum insert krte hai
        //const response=await Todo.create({title,description});isse todo object create krr diya hai and has inserted it in our database

        // const {title,description}=req.body; data fetch krega
        // const response=await Todo.create({title,description}); fetch kiya hua data insert krr dega

        //send a json response with a success flAG
        res.status(200).json({
            //body of json
            success:true,
            data:response,
            message:'Entry created Successfully'
        })
        // res.status(200)=> response ka status 200 krr dega
    }
    catch(err)
    {
         console.error(err);
           console.log(err);
           res.status(500).json({
            success:false,
            data:"internal server error",
            message:err.message,
           })
    }
}
  module.exports={createTodo};