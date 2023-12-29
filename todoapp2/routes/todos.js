const express=require("express")//import express framework
const router=express.Router();

const {createTodo} =require("../controllers/createTodo");//import's controller

router.post("/createTodo",createTodo);


const {getTodo} =require("../controllers/getTodo");//import's controller
//getTodo is a get request
router.get("/getTodo",getTodo);

module.exports=router;
