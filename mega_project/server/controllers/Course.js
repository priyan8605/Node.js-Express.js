const Course=require('../models/Course')
const Category=require('../models/category')
const User=require("../models/User")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const{uploadImageToCloudinary}=require('../utils/imageUploader')
require("dotenv").config();
// createCourse() handler function
exports.createCourse = async (req, res) => {
    try {
      const userId = req.user.id;
  
      let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag,
        category,
        status,
        instructions
        // these all things has been defined in "Course"
      } = req.body;
  
      const thumbnail = req.files.thumbnailImage;
  
    //   const tag = JSON.parse(tag);
    //   const instructions = JSON.parse(instructions);
  
      if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag ||
        !thumbnail ||
        !category 
      ) {
        return res.status(400).json({
          success: false,
          message: "All Fields are Mandatory",
        });
      }
      if (!status || status === undefined) {
        status = "Draft";
      }
  
      const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
      });
      if (!instructorDetails) {
        return res.status(404).json({
          success: false,
          message: "Instructor Details Not Found",
        });
      }
  
      const categoryDetails = await Category.findById(category);
      if (!categoryDetails) {
        return res.status(404).json({
          success: false,
          message: "Category Details Not Found",
        });
      }
  
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
  
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail: thumbnailImage.secure_url,
        status: status,
        instructions,
      });
  
      await User.findByIdAndUpdate(
        { _id: instructorDetails._id },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      );
  
      await Category.findByIdAndUpdate(
        { _id: category },
        {
          $push: {
            courses: newCourse._id,
          },
        },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        data: newCourse,
        message: "Course Created Successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: error.message,
      });
    }
  };

// exports.createCourse=async(req,res)=>
// {
// try
// {
// // agr User logged in hai tbhi to vo courseCreate krr payega
// // agr hume  user ka id nikalna hai to vo hum nikal skte hai kyuki token ke "payload" 
// // me humne id already pass kiya hai see in Auth.js controller where const payload={..,id:user._id}
// // and fir auth.js middleware me  decoded token "decode" ko jisme "id" hai user ka oose hum request me bhej rhe hai
// // req.user=decode

// // 1>fetch data from request body
// const userId=req.user.id//auth.js me req me decoded token "decode" daal rhe hai jisme user ki id hai 
// // userId ke help se hum instructor ko find out krenge
// console.log(`userId => ${userId}`);
// var {courseName,courseDescription,whatYouWillLearn,
//     price,tag:_tag,category,
//     status,
//     instructions: _instructions,}=req.body;

//     // console.log(`tag==> ${tag}`);
//     // console.log(`Instructions==> ${instructions}`);
// // yha category ka id aayga req.body me se coz in model Course.js me Category:{type:....ObjectId,ref:Category}

// // 2>fetch thumbnail req.files.thumbnailImage
// const thumbnail=req.files.thumbnailImage;


//     const tag=JSON.parse(_tag);//convert tag from stringified array to array
// const instructions = JSON.parse(_instructions);
// // console.log(`instructions => ${instructions}`);
// // console.log(`tag => ${tag}`);


   


// // perform validation on the data fetched
// if(!courseName||!courseDescription||!whatYouWillLearn||
//     !price||!tag.length||!category||thumbnail
//    || !instructions.length
// )
// {
//     return res.status(400).json({
//         success:false,
//         message:"All fields are required"
//     })
// }
// if (!status || status === undefined) {
//     status = "Draft"
//   }
// // 4>perform validation for checking instructor kyuki Course.js model ke andr humne 
// // "instructor" property bhi define kiya hai taaki hum Course me "instructor" ki object id bhi rkh ske

// const instructorDetails=await User.findById(userId, {
//     accountType: "Instructor",
//   })//userId ke help se jo user ka detail aayega 
// //vo  user instructor hi hoga kyuki only user who is instructor he only can create a course
// // jo bhi "findById(userId)" userId wala document find out krr ke layha
// console.log(`Instructor details is = ${instructorDetails}`);
// if(!instructorDetails)
// {
//     // agr instructorDetails hi nhi mila then return response
//     return res.status(404).json({
//         success:false,
//         message:"Instructor Details not found",
//     })
// }
// // 5>check whether given category is valid or not => perform validation on the category
// // findByID(category) use krr rhe hai kyuki req.body me se jo "category" fetch krr rhe hai vo category ka id hai naa ki category itself
// // and that category id is only passed as parameter in findById
// const categoryDetails=await Category.findById(category);
// if(!categoryDetails)
// {
//     return res.status(404).json({
//         success:false,
//         message:"Category Details not found",
//     })
// }

// // 6>Upload Image to cloudinary
// const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
// // "thumbnail" file "FOLDER_NAME" folder me jaa krr ke store hoga

// //7> create an entry for new course
// const newCourse=await Course.create({
//     courseName,
//     courseDescription,
//     instructor:instructorDetails._id,
//     price,
//     tag,
//     whatYouWillLearn: whatYouWillLearn,
//     category:categoryDetails._id,//Category ka id "CategoryDetails" me bhi hai aur jo req.body se "category" fetch krr
//     // rhe hai that is also an id of "Category" 
//     // or =>category:category
//     thumbnail:thumbnailImage.secure_url,
//     status: status,
//     instructions,
// })

// // user instructor hai to oose course buy krne ki jroorat nhi hai ooske courselist me ooska created course aa jayga
// // but agr user student hota to student ke buy krne ke baad hi student ke course list me course aata
// // 8>add the new course to the User Schema of Instructor
// await User.findByIdAndUpdate(
//     {
//         _id:instructorDetails._id
//     // ekk aisa user jiska id instructorDetails._id se match krr rha hai oos user ko dhhond krr layga
//      },
//      {
//         // jo user ko oopr dhoond krr laye hai oose user ke course ke  array ke andr jo oopr newCourse create 
//         // kiya hai ooska id store kroonga
//         $push:{
//             courses:newCourse._id,
//             //User.js model me courses property me created newCourse ka id daalenge
//         }
//      },
//      {new:true}
// )

// // 9>Update Category Schema is homework
// const categoryDetails2 = await Category.findByIdAndUpdate(
//     { _id: category },
//     {
//       $push: {
//         courses: newCourse._id,
//       },
//     },
//     { new: true }
//   )
//   console.log(`HEREEEEEEEE =>${categoryDetails2}`)

// // 10>return response
//  res.status(200).json({
//     success:true,
//     data:newCourse,
//     message:"Course Created Successfully",
   
// })
// }
// catch(error)
// {
//     //
//     console.log(`Error in createCourse()==>${error}`);
//      return res.status(500).json({
//     success:false,
//     message:"Failed to create Course",
    
// })
// }
// }

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


// getCourseDetails()
// Course.js model me jitne bhi property humne define kiye 
// hai humm oos saare property ka value getCourseDetails() se lana chahte hai
exports.getCourseDetails=async(req,res)=>
    {
        try
        {
            // agr kisi bhi course ka detail chahiye to hume oos course ka id pta hona chahiye
            // 1>fetch courseId from req.body
            const{courseId}=req.body

            // 2>find course details
            const courseDetails=await Course.find(
                {
                    _id:courseId
                //  courseId ke basis prr course find out krr lenge
                }
            )
            .populate(
                {
                // Course model ke andr vo property jisme objectId pda hai oon objectID wale
                // property ko populate krenge
                path:'instructor' ,//Course model ke andr wala "instructor" property ko populate krega
                populate:{
                  path:'additionalDetails'
                //   Course model ke  "instructor" property me "User" model ka reference hai
                // and "User" model me "additionalDetails" property jo hai vo "additionalDetails" populate hoga yha
                // "additionalDetails" me "Profile" ka reference stored hai
                }
                }
            )
            .populate('category')
            // .populate('ratingAndReviews')
            .populate({
                path:'courseContent',
                //"Course" model me jo "courseContent" hai vo populate hoga jisme "Section" ka objectId as reference pda hai
                populate:{
                    path:"subSection"
                    // "Section" model me jo "subSection" property hai vo populate hoga jisme "SubSection" ke objectId ka reference pda hua hai

                }
            })
            .exec();

            // 3>validate
            if(!courseDetails)
                {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the Course with courseId = ${courseId}`
                    })
                }
            // return response
            return res.status(200).json({
                success:true,
                message:"Course Details fetched successfully",
                data:courseDetails
            })


        }
        catch(error)
        {
          console.log(`Error in getCourseDetails() => ${error}`);
          return res.status(500).json({
            success:false,
            message:error.message,
          })
        }
    }

