const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
// createSubSection()
exports.createSubSection=async(req,res)=>
{
    try
    {
        // SubSection create krne ke time hume "title","video to be uploaded","duration of video","description of a video"
        // ye sbb dena hoga we also need to give "sectionId" kyu ki jo bhi SubSection create krenge vo kisi  Section me insert Krenge
        // jiske liye "sectionId" hum de rhe hai

        // 1>fetch data from req.body
        const{sectionId,title,timeDuration,description}=req.body
        
        // 2>extract file/video
         const video=req.files.videoFile;

        // 3>perform validation
         if(!sectionId || !title || !timeDuration || !description || !video)
         {
            return res.status(401).json({
                success:false,
                message:"All fields are required to create sub-section"
            })
         }
         
        // 4>upload video to cloudinary
        // SubSection ke model me hum video nhi store krr he blki videoUrl store krr rhe hi of String type
         const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //  req.files.videoFile se jo  video fetch kiya oos "video" ko "FOLDER_NAME=CodeHelp" me store krr lenge which is
        // defined in .env
        // "uploadDetails" ke andr hi secureUrl mil jayega
         
        // 5>create a SubSection 
         const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
         })
        //  the id of Created SubSection inside Section where we will find section by sectionId
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
        {
          $push:{
            SubSection:SubSectionDetails._id
          }
        },
        {new:true})
        // HomeWork:log updated section here,after adding populate query

        // 6>return response
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully",
            
         })
    }
    catch(error)
    {
        console.log(`Error in createSubSection()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"Can't create SubSection "
        })
    }
}

//homework:-updateSubSection


//homework:-deleteSubSection