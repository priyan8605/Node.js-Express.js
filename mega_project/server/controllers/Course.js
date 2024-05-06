const Course=require('../models/Course')
const Tag=require('../models/tags')
const User=require("../models/User")
const{uploadImageToCloudinary}=require('../utils/imageUploader')
require("dotenv").config();
// createCourse() handler function
exports.createCourse=async(req,res)=>
{
try
{
// agr User logged in hai tbhi to vo courseCreate krr payega
// agr hume  user ka id nikalna hai to vo hum nikal skte hai kyuki token ke "payload" 
// me humne id already pass kiya hai see in Auth.js controller where const payload={..,id:user._id}
// and fir auth.js middleware me  decoded token "decode" ko jisme "id" hai user ka oose hum requese me bhej rhe hai
// req.user=decode

// 1>fetch data from request body
const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
// yha tag ka id aayga req.body me se coz in model Course.js me tag:{type:....ObjectId,ref:tag}

// 2>fetch thumbnail req.files.thumbnailImage
const thumbnail=req.files.thumbnailImage;

// perform validation on the data fetched
if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag||thumbnail)
{
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    })
}
// 4>perform validation for checking instructor kyuki Course.js model ke andr humne 
// "instructor" property bhi define kiya hai taaki hum Course me "instructor" ki object id bhi rkh ske
const userId=req.user.id//auth.js me req me decoded token "decode" daal rhe hai jisme user ki id hai 
// userId ke help se hum instructor ko find out krenge
const instructorDetails=await User.findById(userId)//userId ke help se jo user ka detail aayega 
//vo  user instructor hi hoga kyuki only user who is instructor he only can create a course
// jo bhi "findById(userId)" userId wala document find out krr ke layha
console.log(`Instructor details is = ${instructorDetails}`);
if(!instructorDetails)
{
    // agr instructorDetails hi nhi mila then return response
    return res.status(400).json({
        success:false,
        message:"Instructor Details not found",
    })
}
// 5>check whether given tag is valid or not => perform validation on the tag
// findByID(tag) use krr rhe hai kyuki req.body me se jo "tag" fetch krr rhe hai vo tag ka id hai naa ki tag itself
// and that tag id is only passed as parameter in findById
const tagDetails=await Tag.findById(tag);
if(!tagDetails)
{
    return res.status(400).json({
        success:false,
        message:"Tag Details not found",
    })
}

// 6>Upload Image to cloudinary
const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
// "thumbnail" file "FOLDER_NAME" folder me jaa krr ke store hoga

//7> create an entry for new course
const newCourse=await Course.create({
    courseName,
    courseDescription,
    instructor:instructorDetails._id,
    price,
    whatYouWillLearn:instructorDetails._id,
    tag:tagDetails._id,//tag ka id "tagDetails" me bhi hai aur jo req.body se "tag" fetch krr
    // rhe hai that is also an id of "tag" 
    // or =>tag:tag
    thumbnail:thumbnailImage.secure_url
})

// user instructor hai to oose course buy krne ki jroorat nhi hai ooske courselist me ooska created course aa jayga
// but agr user student hota to student ke buy krne ke baad hi student ke course list me course aata
// 8>add the new course to the User Schema of Instructor
await User.findByIdAndUpdate(
    {
        _id:instructorDetails._id
    // ekk aisa user jiska id instructorDetails._id se match krr rha hai oos user ko dhhond krr layga
     },
     {
        // jo user ko oopr dhoond krr laye hai oose user ke course ke  array ke andr jo oopr newCourse create 
        // kiya hai ooska id store kroonga
        $push:{
            courses:newCourse._id,
            //User.js model me courses property me created newCourse ka id daalenge
        }
     },
     {new:true}
)

// 9>Update Tag Schema is homework


// 10>return response
return res.status(200).json({
    success:true,
    message:"Course Created Successfully",
    data:newCourse,
})
}
catch(error)
{
    console.log(`Error in createCourse()==>${error}`);
return res.status(500).json({
    success:false,
    message:"Failed to create Course",
   error:error.message
})
}
}

// getAllCourses handler function 
exports.showAllCourses=async(req,res)=>{
    try
    {
      // 1>Hume saare Courses chahiye so we use find() similar to Select in sql
      const allCourses=await Course.find({},
                                {courseName:true,ratingAndReviews:true,studentsEnrolled:true,
                                    instructor:true,price:true,thumbnail:true
                                    // these are the conditio  which a course must have
                                }
                //  saare course le krr aayega with a condition ki oon course me courseName,ratingAndReviews...,thumbnail hona chahiye
                    ).populate("instructor").exec();

        // 2>return response
        return res.status(200).json({
            success:true,
            message:"All Course fetched Successfully",
            data:allCourses,
        })
    }
    catch(error)
    {
        console.log(`Error in showAllCourses()==> ${error}`);
        return res.status(500).json({
            success:false,
            message:"Can not fetch all courses",
           error:error.message
        })
    }
}