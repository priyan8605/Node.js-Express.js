const mongoose=require('mongoose');
const Category=require('./category')
const User=require('./User')
const Section=require('./Section')
const SubSection=require('./SubSection')
const RatingAndReview=require('./RatingAndReview')
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Section"
    }],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }]
})
module.exports=mongoose.model("Course",courseSchema);