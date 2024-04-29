
// jbb tkk OTP verify nhi hota user signup nhi krr skta 
// 1>sendOTP handler
// 2>SignUp handler
// 3>Login handler
// 4>change Password handler

const User=require('../models/User')
const OTP=require('../models/OTP')
const otpGenerator=require("otp-generator")


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
    // 1>fetch data  from request's body
    const{firstName,lastName,email,
        password,confirmPassword,
        accountType,contactNumer,
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
    const resetOtp=await OTP.find({email});//request ke body se jo email fetch kiya ooske aadhar prr otp find krne ki koshis krr rhe hai

    // 6>validate OTP
    // 7>Hash the password
    // 8>create entry in DB
    // 9>return response
    
    
}