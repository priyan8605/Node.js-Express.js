const express=require('express')
const router=express.Router();

const{localFileUpload,imageUpload} =require('../controllers/fileUpload')//will import all the handlers present in 'controllers' folders  fileupload.js

// api route
router.post('/localFileUpload',localFileUpload)
router.post('/imageUpload',imageUpload)
 module.exports=router

