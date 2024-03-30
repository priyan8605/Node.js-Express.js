const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
const fileSchema=new mongoose.Schema({
    name:{
           type:String,
           required:true,
    },
    imageUrl:{
        type:String,
    },
    videoUrl:{
        type:String
    },
    tags:{
          type:String
    },
    email:{
        type:String
    }
})

// post middleware hume lgayenge "save" method prr hi kyki Db me save hone ke baad hii hum mail bhejenge 
fileSchema.post('save',async function(doc){
try{
  console.log("DOC = ",doc);//jo bhi entry database me create hui hai vhi "doc" me hai

// transporter
let transporter=nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    // host: "smtp.gmail.com",
    service:'gmail',
    transportMethod: "SMTP",
    secureConnection: true,
    port: 465,
    secure: true,
    auth:{
     user:process.env.MAIL_USER,
     pass:process.env.MAIL_PASS,
    }
})

// send mail
let info=await transporter.sendMail({
    from: 'priyanshu'   ,
    to: doc.email,//doc me jo email key hai oosme jo email hai oos email ko ye mail jayega
    subject: 'new file uploaded in cloudinary' ,
    html:`
          <h2>Hello jee</h2>
          <p>File uploaded</p>
          <p>View File here : <a href='${doc.imageUrl}'>${doc.imageUrl}</a></p>
          ` ,

})
console.log('INFO IS ', info);
}
catch(error)
{
console.error(`Error in post middleware is ${error}`)

}
})
const File=mongoose.model('File',fileSchema);
module.exports=File