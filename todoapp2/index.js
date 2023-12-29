const express=require('express');//require() imports "express"
const app=express();//backend application named "app" is created

// app.listen(4000,()=>
// {
//     console.log("App is running successfully");
// });

// hum chahte hai ki jo server hai kisi port ke oopr listen kre iske liye best practice hai ki
//.env file se hmara config load ho
require("dotenv").config();//loads config from ".env" file

const PORT=process.env.PORT || 4000;//ya to port number process se aayga nhi to by default port number 4000 hoga



//middleware to parse json request body
app.use(express.json());//app use krega express.json middleware ko for parsing


// imort routes for TODO API
const todoRoutes=require("./routes/todos");

//mount the todobAPI routes
app.use("/api/v1",todoRoutes)//http://localhost:4000/api/v1/

// now we can start our server
app.listen(PORT,()=>
{
    console.log(`Server started successfully at ${PORT}` );
})

// connect to the database
const dbConnect=require("./config/database");
dbConnect();//calling dbConnect method present in config folder file database.js

//default Route
app.get("/", (req,res) => {
    res.send(`<h1> This is HOMEPAGE baby</h1>`);
})
