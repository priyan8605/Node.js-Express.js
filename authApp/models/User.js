const mongoose=require('mongoose')
const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            // agr name:"hello  " it will save as name:"hello" coz of trim true  as space are eliminated
        },
        email:{
            type:String,
            required:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:["Admin","Student","Visitor"],//either a role can be admin or student or visitor
            // with "enum" role has been defined kisko permission dena hai
            default:"Admin",//set as default role
        }
    }
)
module.exports=mongoose.model('user',userSchema)