const mongoose=require('mongoose');//imports mongoose

const dbConnect=()=>
{
  mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
  }).then(()=>{console.log(" DB connection successful")}).catch((error)=>{
    console.log(error+" in DB connection");
    console.error(error.message);
    process.exit(1);
})
}
// "const dbConnect" this function will establish connection between database and our application
//"(process.env.DATABASE_URL)" 'process' object me se ootha ke layenge databaseka url
//pr humne database ka url ".env" me likha hai to isiliye hume pahle database ke url ko feed krna hoga process object ke andr
//and this feeding can be done using .env library using "npm i dotenv"  in terminal
require("dotenv").config();//is line ke wajah se jo bhi humne ".env" ke andr define kiya hai that will load into "process object"
module.exports=dbConnect;

// "database.js" file will ensure connection between database and our application