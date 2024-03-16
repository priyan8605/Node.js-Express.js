const express=require('express');
const app=express();
require('dotenv').config();
const port=process.env.port || 4000;
app.use(express.json());//server ko request ke body me se data lana hai to vo oos data ko parse krke layga
const connect=require('./config/database')
connect();


const user=require('./routes/user');
app.use("/api/v1",user);//mounting

// activating the server
app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
})
