//create app
const express=require('express')
const app=express();

// PORT Find out
require('dotenv').config();
const PORT=process.env.PORT || 3000

// adding middleware
app.use(express.json())
// npm install express-fileupload
const fileupload=require("express-fileupload")//imports package
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

// db se connect krna hai
const db=require('./config/database')
db.connect()

//cloud se connect krna hai 
const cloudinary=require('./config/cloudinary')
cloudinary.cloudinaryConnect()

// api route mount krna hai

const Upload=require('./routes/FileUpload')
app.use('/api/v1/upload',Upload)

// activate server
app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
})