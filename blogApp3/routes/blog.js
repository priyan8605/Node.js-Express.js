// 1> yha express ka instance laaye
// 2> fir apna route create krenge
// 3> fir controller import krenge
// 4> route or path ko controller se map krayenge
// 5> ecports the router

const express=require('express');//instance of express
const router=express.Router();//create route with help of express

//import controller
const {dummyLink}=require("../controllers/likeController");

//mapping route with controller
router.get("/dummyroute",dummyLink);


// post request for Comment

//import controller
const {createComment}=require('../controllers/commentController')
//map route with controller
router.post("/comments/create",createComment)

// "post" request for "createPost"
const {createPost}=require("../controllers/postController")
//map route with controller
router.post("/posts/create",createPost);

// "get" request for "getAllPost" 
const {getAllPosts}=require("../controllers/postController")
router.get("/posts",getAllPosts)

// "post" request for "likePost"
const {likePost}=require("../controllers/likeController")
router.post("/likes/like",likePost);

// "post" request for unlike
const{unlikePost}=require("../controllers/likeController")
router.post("/likes/unlike",unlikePost)

// export
module.exports=router;

 
