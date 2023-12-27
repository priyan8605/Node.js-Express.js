const mongoose=require('mongoose');
const todoSchema=new mongoose.Schema(
    {
        // schema ke andr hum data ka structure define krr rhe hai
        //todo object ke andr hum title,description,  rkhna chahte hai
        title:{
            type:string,
            required:true,//mtlb title chahiye hi chahiye
            maxLength:50,
        },
        description:{
            type:string,
            required:true,
            maxLength:50,
        },
        createdAt:{
            // at which time we have created our data
            type:Date,
            required:true,
            default:Date.now(),//default date agr hum date  nhi de paa rhe hai tbb
        },
        updatedAt:{
            // at which time we have updated our data
            type:Date,
            required:true,
            default:Date.now(),//default date agr hum date  nhi de paa rhe hai tbb
        }
    }
)