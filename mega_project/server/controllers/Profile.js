// jbb bhi koi SignUp krta hai user to oos time ekk nakli Profile bnn
// rha hota hai (see Auth.js controller==>exports.signup=()=>{ ... const profileDetails=await Profile.create()})
// jha prr hrr ek field me null store kiya tha

const Profile=require('../models/Profile')
const User=require('../models/User')

// we only need to update Profile and no need to create it as it already have been created

exports.updateProfile=async(req,res)=>
{
    try
    {
    //   agr User logged in hai to decoded token "decode" me(see "auth.js middleware login()  const payload") user ka id aa hii rha hoga "Auth.js controllers se"
    // token jo ki decoded hai i.e "decode"(auth.js middleware) isme user id hai and "decode"
    // ko hum requset me bhej hi rhe hai "req.user=decode in auth.js middleware"
    // so user id will be alrady present in req.body

    // 1>fetch data
    const {dateOfBirth="",about="",contactNumber,gender}=req.body;
    // agrr dateOfBirth ya about req.body me se aa rha hai to oose lo nhi to by default oose empty String maaan lo

    // 2>fetch userId
    const id=req.user.id;
    // req.user=decode  =>auth.js models
    // const payload={id:user._id} ==>Auth.js controllers

    // 3>Perform validation
    if(!contactNumber||!gender||!id)
    {
        return res.status(401).json({
            success:false,
            message:"All fields are required"
        })
    }

    // 4>find already created Profile
    const userDetails=await User.findById(id);//will find the user with help of user id coming from request
    // abb user hum find krr liya and to abb hume user ke and Profile id mil jayega jo ki user
    // ke additionalDetails property me pda hua hai
    const profileId=userDetails.additionalDetails;//find profile id
    // abb  profileId mil gya so profile ka poora ka poora data bhi hum nikal ke laa skte hai
    const profileDetails=await Profile.findById(profileId);

    // 5>update already created Profile
    profileDetails.dateOfBirth=dateOfBirth;
    profileDetails.about=about;
    profileDetails.gender=gender;
    profileDetails.contactNumber=contactNumber;
    // abb Profile ka object bna pda hai already bss hum profile ke details update kiye abhi to
    // abb in updated profileDetails ko save krenge
    await profileDetails.save();

    // 6>return response
    return res.status(200).json({
        success:true,
        message:"Profile updated successfully"
    })

    }
    catch(error)
    {
        console.log(`Error in updateProfile()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"can't update Profile"
        })
    }
}
