const mongoose=require('mongoose');
require("dotenv").config();
const connectwithDb=()=>{
    mongoose.connect(process.env.DATABASE_URL,
        {
            useNewURLParser:true,
            useUnifiedTopology:true,
        }).then(()=>console.log("DB connection successful" )).catch((err)=>
        {
             console.log(`${err} in DB connection`);
            process.exit(0);
            
        }
      )
}
module.exports=connectwithDb;
