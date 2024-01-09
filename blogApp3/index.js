const express=require('express');
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 3000;
app.use(express.json());//middleware for put and post request

const blog=require("./routes/blog");//import routes

app.use("/api/v1",blog);//mounting

const connectWithDb=require("./config/database");
connectWithDb();

//start the server
app.listen(PORT,()=>
{
    console.log(`App started at PORT number ${PORT}`);
})

app.get("/",(req,res)=>{
    res.send(`<h1>This is my homePage baby</h1>`);//response send by our app server to webpage(or client)
})
