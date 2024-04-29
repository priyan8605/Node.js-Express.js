const mongoose=require('mongoose')
const OTPSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  otp:{
    type:String,
    required:true
  },
 createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,//expires in 5 min
 }
})

// Create a function whose sole intent is to send an email
async function sendVerificationEmail(email,otp)
{
    // parameter "email" vo email  hai jisskoo otp as a mail bhejna hai
    // parameter "otp" vo otp jo ki mail ke saath jayega
    try{
        const mailResponse=await  mailSender(email,"Verification enmail from StudyNotion",otp);
        console.log(`Email sent successfully : ${mailResponse}`);
    }
    catch(error)
    {
        console.log(`Error occured while send ing mail : ${error}`);
        throw error;
    }
}

// Document DB me save hone se just pahle pre middleware will call sendVerificationEmail() which will send 
// an email to the user and also the otp and after this go to next middleware bcoz of next()
OTPSchema.pre('save',async function(next){
    await sendVerificationEmail(this.email,this.otp)//this.email is current object email and this.otp is current object otp
    next();//will call the next middleware
})
module.exports=mongoose.model("OTP",OTPSchema);