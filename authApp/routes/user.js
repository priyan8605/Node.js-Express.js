const express=require('express');
const router=express.Router();
const {signup}=require('../Controllers/Auth');

// signup route
router.post('/signup',signup)

const {login}=require('../Controllers/Auth');
// login route
router.post('/login',login)
module.exports=router