
// jbb tkk OTP verify nhi hota user signup nhi krr skta 
// 1>sendOTP handler
// 2>SignUp handler
// 3>Login handler
// 4>change Password handler

const User=require('../models/User')
const OTP=require('../models/OTP')
const otpGenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config();
// 1> sendOTP()
exports.sendOTP=async(req,res)=>
{
    try
    {
        const {email}=req.body;//fetch email from request's body
        
        // check whether user already exists or not
        const checkUserPresent=await User.findOne({email});//based on the 'email' fetched from request body
        // we will try to find whether User exists or not 
        
        // if user already exists then return response
        if(checkUserPresent)
        {
            return res.status(401).json({
                success:false,
                message:"User already registered",
            })
        }

       // User already do not exists so generate OTP
       var otp=otpGenerator.generate(6,{
             upperCaseAlphabets:false,
             lowerCaseAlphabets:false,
             specialChars:false}
             )

         console.log(`OTP generated is = ${otp}`);

        //  check otp  is unique or not
        const result=await OTP.findOne({otp:otp})//will check in DB whether 'otp' alrady exist in DB or not

        while(result) //jbb tkk DB me result ke corresponding 'otp' mil rha hai tbb tkk hum new otp generate krte rhenge
        {
            otp=otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });

                result=await OTP.findOne({otp:otp})
        }

        // after creating unique otp we will crete an otp object which consist of 'email' , 'otp', 'createdAt'
        // and now after crating an unique otp we have to do this unique otp entry in DB
        const otpPayload={email,otp};//agr hum cratedAt nhi daalte hai to by default Date.now() will 
        // come in place of createdAt ==> see in OTP.js

        // create an entry for OTP
        const otpBody=await OTP.create(otpPayload);//an object is created becoz of create()
        console.log(`otpBody is = ${otpBody}`);

        // return response
        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp
        })

    }
    catch(error)
    {
        console.log(`error in Auth.js ==>`);
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//signUP()
exports.signUp=async(req,res)=>{
 try
 {
       // 1>fetch data  from request's body
       const{firstName,lastName,email,
        password,confirmPassword,
        accountType,contactNumber,
        otp
    }=req.body;  

    // 2>perform validation of data
    if(!firstName || !lastName || !email ||
         !password || !confirmPassword || 
         !otp )//agre inme se koi bhi ekk empty hai to retuen response
         {
           return res.status(403).json({
            success:false,
            message:"All fields are required"
           })
         }

    // 3> password and confirm password ye 2 password ko matych krwa lo
    if(password!==confirmPassword)
    {
        return res.status(400).json({
            success:false,
            message:'Password and confirm Password do not match'
        })
    }


    // 4>check user already exists or not
      const existingUser=await User.findOne({email});
      if(existingUser)
      {
        return res.status(400).json({
            success:false,
            message:'User already registered',
        });
      }

    // 5>find most recent OTP stored in DB for the user
    const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);//request ke body se jo email fetch kiya ooske aadhar prr otp find krne ki koshis krr rhe hai
    // aur ho skta hai ki iss email se related multiple otp mil jaye but hume recent wala chahiye so we use sort({createdAt:-1}).limit(1)
    console.log(recentOtp)

    // 6>validate OTP
    if(recentOtp.length===0)
    {
        // .length property in JavaScript is used to determine the length of a given string
        return res.status(400).json({
            success:false,
            message:"OTP found"
        })
    }
    else if(otp!==recentOtp.otp)//"otp"=>fetched from req.body and "recentOtp.otp"=>otp fetched from DB
    {
        return res.status(400).json({
            success:false,
            message:"Invalid OTP"
        });
    }

    
    // 7>Hash the password
    const hashedPassword=await bcrypt.hash(password,10)

    // 8>create entry in DB
    const profileDetails=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
        // ye sbb Profile schema or model me defined hai
    })
      const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,//isme Profile model ka object id daala hai
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        // jbb bhi koi signup krega to because of the link in "image:`link`" by default oos user ka
        // image create hoga firstName and lastName se aur vo oos user ke Profic pic bnn ke stopre ho jayega

      })

    // 9>return response
    return res.status(200).json({
        success:true,
        message:"User registered successfully",
        user
    })
 }
 catch(error)
 {
  console.log(`error in signUP() = ${error}`);
  return res.status(500).json({
    success:false,
    message:"User cannot be registered , please try again"
  })
 }
}

// login()
exports.login=async(req,res)=>
{
    // login krne ke liye request ke body me 2 cheez aayega 'email' and 'password'
    // jbb bhi koi user login krr rha hota hai to hum jwt token generate krte hai aur jwt token ko response ke
    // saath hi user ko bhej dete hai
    try
    {
        // 1>get data from request body
          const{email,password}=req.body;
        // 2>perform validation on data fetched from request's body
           if(!email || !password) //agr email ya password empty aa jaye
           {
            return res.status(403).json({
                success:false,
                message:"All fields are required please try again"
            })
           }
        // 3>check whether user already exists or not based on 'email' fetched from req.body
        const user=await User.findOne({email}).populate("additionalDetails");//"User" model me jo "additionalDetails" property hai 
        // oosme "Profile" ka Object id as reference naa jaa krrr actual "Profile" document jayega
        // haala ki bina populate() ke bhi kaam chal jayega
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User is not registered , please signUP first"
            })
        }
              
        // 4>agr User already exist  nhi krr rha then match the password using compare()
        //  and then generate jwt token
        if(await bcrypt.compare(password,user.password))//"password"=>fetched from req.body and "user.password"=>password present in  mongoDB document wrt respective email
        {
            // agr password matches then this if() execute
            const payload={
                email:user.email,//user.email=>coming from DB
                id:user._id,//user._id=>coming from DB
                accountType:user.accountType,//user.accountType=>coming from DB
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            });
            user=user.toObject();//converts mongoose document to an object
            user.token=token;
            user.password=undefined;

            // 5>create cookie and send response
            const options={
                expires:new Date(Date.now+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
    }
    catch(error)
    {
      console.log(`error in login() = ${error}`);
      return res.status(500).json({
        success:false,
        message:"Login failure, please try again"
      })
    }
}

// changePassword
exports.changePassword=async(req,res)=>{

}