// "/student" is a route only for students hence it's protected route
// "/admin" is a route only for admins hence it's protected route .
// "/student" and "/admin" is a protected 

// auth,isStudent ,isAdmin these 3 middleware we have to create

const jwt=require('jsonwebtoken')
require("dotenv").config();//as we want "jwt_secret" from ".env"

// "auth" middleware is used for authentication as it uses "token" to authenticate th user
exports.auth=(req,res,next)=>{
    // here we have to pass 3 parameter
    //router.get("/admin",auth,isAdmin) here we want that after "auth" middleWare "isAdmin" middleware should get called
    // so for this "next is paased in parameter"

    try{
    //   extract jwt token as token is present inside request body
    // we can extract token from body as well as header and as well as from cookies

    //1> extracting token from request body or cookies or
  
     // jb bhi user ne login request kiya hoga server ne cookies client ko response me de diya hoga and 
   // Abb jbb user doobara request krega to ooske request me cookies bhi honge and cookies me token hai which we have assigned in "Auth.js" me already token present hai
    console.log("cookies",req.cookies.token);

     // jb bhi user ne login request kiya hoga server ne token client ko response me de diya hoga
   // Abb jbb user doobara request krega to ooske request ke body me already token present hai
    console.log("body",req.body.token);
    
    const token=req.body.token || req.cookies.token || req.header('Authorization'.replace('Bearer ',''));

    if(!token)//2>agr request ke body me token hai hi nhi then if() 
    {
      // sending response that token is missing in request body
         return res.status(401).json({
            success:false,
            message:'Token Missing'
         })
    }
     
    // 3>verify token
    try{
        // verify(<token>,<secret key>) =>gives us decoded token
        const payload=jwt.verify(token,process.env.jwt_secret)//token ke andr jo bhi value hai vo "payload" variable me store hoga
        console.log("payload is ");
        console.log(payload);
        req.user=payload;//"req" me decoded token store krwa rhe hai ye smjhege 'isStudent' middleware me
        //"role" token "payload" ke data ke andr pda hai and hume request me "role" chahiye taaki authorization ho ske 
        // so we are assigning "decode" to "request"

    }
    catch(error)
    {
      console.error(`Error in decoding token ${token}`)
      res.status(401).json({
        success:false,
        message:'token is invalid'
      })
    }
    next();//will take us to the next middleware
    }
    catch(error)
    {
       console.log(`Error in auth is ${error}`);
       return res.status(401).json({
        success:false,
        message:"something went wrong while verifying the token"
       })
    }
}


// isStudent middleware is used for authorization as it's checking role
exports.isStudent=(req,res,next)=>{
    try{
        // checking authorization for student
     if(req.user.role !=='Student' )
     {
        //agr "req" ke andr "user" ke andr "role" me "Student" nhi hai then if()
        //req.user=decode==>isse "decode" ke andr jo role hai that will get into "req.user"
        return res.status(401).json({
            success:false,
            message:"This is a protected route for student"
        })
     }
  //no need to give success response here success true bcoz res is already defined in user.js routes
  //  defined inside user.js router.get('/student',auth,isStudent,(req,res)=>{
  //     res.status(200).json({
  //         success:true,
  //         message:"welcome to the protected route for students"
  //     })

     next();
    }
    catch(error)
    {
       return res.status(500).json({
         success:false,
         message:'User Role is not matching'
       })
    }
}

// isAdmin is used for authorization as it's checking for role
exports.isAdmin=(req,res,next)=>{
    try{
        // checking authorization for Admin
     if(req.user.role !=='Admin' )
     {
        //agr "req" ke andr "user" ke andr "role" me "Admin" nhi hai then if()
        //req.user=decode==>isse "decode" ke andr jo role hai that will get into "req.user"
        return res.status(401).json({
            success:false,
            message:"This is a protected route for student"
        })
     }
  //no need to give success response here success true bcoz res is already defined in user.js routes
  //  defined inside user.js router.get('/admin',auth,isAdmin,(req,res)=>{
  //     res.status(200).json({
  //         success:true,
  //         message:"welcome to the protected route for Admin"
  //     })

     next();
    }
    catch(error)
    {
       return res.status(500).json({
         success:false,
         message:'User Role is not matching'
       })
    }
}