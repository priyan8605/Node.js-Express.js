// 1> yha express ka instance laaye
// 2> fir apna route create krenge
// 3> fir controller import krenge
// 4> route or path ko controller se map krayenge
// 5> ecports the router

const express=require('express');//instance of express
const router=express.Router();//create route with help of express

//import controller
const {dummyLink}=require("../controllers/LikeController");

//mapping route with controller
router.get("/dummyroute",dummyLink);

// export
module.exports=router;

 
