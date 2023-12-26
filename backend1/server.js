const express=require('express');//Instantiate of express
const app=express();//creating app of instance of express "express"

const bodyParser=require('body-parser');//yha body-parser ka object aa jayga
//with the help of body-parser we want to power up our server "app"
app.use(bodyParser.json())//app server ko bol diya bodyParser ko use krne ke liye
//aap.use(bodyParser.json())/ yha hum bol rhe hai specifically parse json data and add it to the request.body object


// activate the sever on portr 3000
app.listen(3000,()=>
{
    console.log("sever started at port 3000");
})//sever ko port 3000 pr chla rhe hai

//Routes
app.get('/',(req,res)=>{
    res.send("hello jee")
})
app.post('/api/cars',(request,response)=>{
    const {name,brand}=request.body;
    // destructing krr ke request ke body me se name and brand nikal liya
    console.log(name);
    console.log(brand);
    response.send("cars submitted successfully.")
})

const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase',
{
    useNewUrlParser:true,
   // useFindAndModify: false,
    useUnifiedTopology:true
})
.then(()=>{console.log("connection successfull")})
.catch((error)=>{console.log("Recieved an"+ error)});