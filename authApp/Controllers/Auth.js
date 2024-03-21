const jwt = require("jsonwebtoken");

const bcrypt=require("bcrypt")//used for hashing password
const User=require("../models/User");//import model as we have to interact with DB using model
require('dotenv').config();//as we want jwt_secret from .env file
// signup route handler
exports.signup=async(req,res)=>{
    try{
//   signup krene ke liye pahle 1> hume input data le krr aana hoga
const{name,email,password,role}=req.body;//all this will be fetched from request body
//2>see user already exists or not iske liye we have to do DB interaction 
let existingUser=await User.findOne({email})//req.body me se jo "email" aaya oose User.js model ke through database me find kro ki 
// vo "email" hai ya nhi
    if(existingUser)
    {
        // agr dono database ke andr ka email and request ke body se jo email aaya hai vo dono match ho jaye then
        return res.status(400).json(
            {
                success:false,
                message:'User already exists'
            }
        )
    }

    // 3>secure password
    let hashPassword;
    try{
        hashPassword=await bcrypt.hash(password,10)//1st parameter is "password" jise hash krna hai and 10 is number of rounds jaha tkk hash krna hai
    }
    catch(error)
    {
        //  agr hashing me error aaya to
        res.status(500).json({
            success:false,
            message:"Error in hashing password",
        })
    }

    // 4>creating user
    const user=await User.create(
        {
            // because of Create() "user" object is created with the help of model(i.e User.js)
            name,email,password:hashPassword,role,//ye sbb "user" object ka data hum DB me insert krenge

        }
    )

    return res.status(200).json({
        success:true,
        message:"User created Successfully"
    });
    }

    catch(error)
    {
        console.log(`Error is ${error}`);
      res.status(500).json({
        message:"User can't be registered please try again"
      })
    }
}


// login
exports.login = async (req,res) => {

    try
    {
        const {email,password}=req.body;//data fetch
       
        // validation on email and password
        if(!email ||!password)
        {//agr "email" and "password" me data nhi pda hai
            return res.status(400).json({
                // 400  is bad request
                success:false,
                message:"Please provide email and password"
            })
        }

        // check whether user is present or not in database
        let user=await User.findOne({email})//req.body me se jo "email" aaya oose User.js model ke through database me find kro ki 
        // vo "email" hai ya nhi
        if(!user)
        {//agr entered "email" database ke "email" se match nhi hua to if(!user)
            return res.status(401).json({
               // 401 is unauthorized access 
                success:false,
                message:"User not found"
            })
        }


        const payload = {
            email:user.email,
            id:user._id,//._id is the id  that is present in mongodb
            role:user.role,
            
            
        }
        // verify password
        const isMatch=await bcrypt.compare(password,user.password)//jo database se password aaya that is stored in "user"
      
        if(isMatch)
        {
            // when entered "password" database ke "hashpassword"  matches 

            // create token
           const token=jwt.sign(payload,process.env.jwt_secret,
                {
                    expiresIn:"2h",
                }
            )
           // user.token=token;//user.token mtlb user object ka property token 
            // user.token=token mtlb user object ka property token me token jo ki create kiya hai that is inserted

            user=user.toObject();
            user.token=token;

           console.log(user.password);
            user.password=undefined;//user object ke andr jo password hai oose hata dega to prevent hacking
            // database me se password nhi htaya hai
            console.log(user.password);
            const options={
               expires:new Date(Date.now()+3*24*60*60*1000),//cookies expires in 3 days from now
               //3*24*60*60*1000=>day*hour*minute*second*millisec
               //Date.now() means from now
               httpOnly:true// it means that the cookie is accessible only via HTTP(S) requests and cannot be accessed by client-side JavaScript running in the browser

            }
            res.cookie('token',token,options).status(200).json(
                {
                    success:true,
                    token,
                    user,
                    message:"user logged in successfully"
                }
            )
            // res.status(200).json(
            //     {
            //         success:true,
            //         token,
            //         user,
            //         message:"user logged in successfully"
            //     }
            // )
        }
        
        else{
            //agr entered  "password" database ke "hashpassword" se match nhi hua to else{}
            return res.status(403).json({
                // 403 is forbidden access meaning client does not have permission to access data
                success:false,
                message:"Invalid password"
            })
        }
    }
    catch(error)
    {
        console.error(`Error due to ${error}`);
        res.status(500).json({
            
            success:false,
            message:"LogIn Failed!"
        })
    }
}