const express=require('express');
const router=express.Router();
const {signup}=require('../Controllers/Auth');
const User=require('../models/User')
// signup route
router.post('/signup',signup)

const {login}=require('../Controllers/Auth');
// login route
router.post('/login',login)

const {auth,isStudent,isAdmin}=require('../middlewares/auth') //imported the middleware

//testing protected routes for single middleware
router.get('/test',auth,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome to the protected route for Tests"
    })

}
) 


//protected routes for Student
router.get('/student',auth,isStudent,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome to the protected route for students"
    })

    // agr "student" route  prr request aata hai to sbse pahle "auth" middleware chalega jo ki authentication request check krega
    //fir second  "isStudent" wala middleware chalega jo ki check krega ki jo person aaya hai oosko "Student" role assign hai ki nhi
}
) 

router.get('/admin',auth,isAdmin,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome to the protected route for Admin"
    })

    // agr "/admin" route  prr request aata hai to sbse pahle "auth" middleware chalega jo ki authentication request check krega
    //fir second  "isAdmin" wala middleware chalega jo ki check krega ki jo person aaya hai oosko "Admin" role assign hai ki nhi
}
) 

router.get('/getEmail',auth,async(req,res)=>{
    // as we will go on '/getEmail' path "auth" middleware will execute and in "auth" middleware
    // only we are sending payload in request  in auth.js file=>   req.user=payload;
   
    try{
        const id=await req.user.id;//fetching id jo ki 'req'  aaya hai
        console.log("ID: ",id);
        const user=await User.findById(id);//jo id hume "req" se mila vo id database me jaa krr dekhenge and oos particular id 
        //   user=user.toObject();

        // ka database me jo bhi data hai that we will  bring
        res.status(200).json({
            success:true,
           
            user:user,//we will get all user data on UI or in respnse 
            // and this 'user' data we had find using 'id' which we are getting from 'req'
            message:'got Email Route'
            
        });

    }
    catch(error)
    {
        console.log(`Error in getEmail ${error}`)
        res.status(500).json({
            success:false,
            error:error.message,
            message:`can't getEmail Route`
            
        });
    }
   
})

module.exports=router