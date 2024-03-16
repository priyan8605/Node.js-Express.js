const bcrypt=require("bcrypt")//used for hashing password
const User=require("../models/User");//import model as we have to interact with DB using model

// signup route handler
exports.signup=async(req,res)=>{
    try{
//   signup krene ke liye pahle 1> hume input data le krr aana hoga
const{name,email,password,role}=req.body;//all this will be fetched from request body
//2>see user already exists or not iske liye we have to do DB interaction 
const existingUser=await User.findOne({email})//req.body me se jo "email" aaya oose User.js model ke through database me find kro ki 
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
