const File=require('../models/File')
const cloudinary=require('cloudinary').v2

// localfileupload --> header function
// localfileupload will fetch media from the path of a client and uploads media on the servers path
// in short client ke path se hum server ke path prr data upload krwana chahte hai
exports.localFileUpload=async(req,res)=>{
    try{
        //1>fetching file from the request
        const file=req.files.file;
        console.log('file we got from request',file);
     

        //2>define path of server on which  we want to upload the file
        // "__dirname" it means the current working directory at which we are at present here it's "controllers"

        let path=__dirname+'/files/'+Date.now()+`.${file.name.split('.')[3]}`;//path of server at which file is being uploaded
        // controllers ke andr "files" wala folder hai and "files" wala folder ke andr jo bhi file hai ooska naam
        // Date.now() ke aadhar prr rkhenge
        console.log(`path is ${path}`);
        
        // 3>file agr upload krna hai to file ke andr move wala function define krna hai bhott important hai
        // file.mv(path,function) => parameter me jo "path" hai oosi path prr file move krega
        file.mv(path,(err)=>{
            console.log(err);
        })
        res.json({
            // response  ;
            success:true,
            message:"Local file uploaded successfully"
        })

    }
    catch(error)
    {
      console.log(`Error in fileUload.js ${error}`);
    }
}

function isFileTypeSupported(type,supportedTypes)
{
    return supportedTypes.includes(type)
    // The includes() method returns true if a string contains a specified string.
}
async function uploadFileToCloudinary(file,folder)
{

    const options={folder}//options is an object which represent "image" folder that we have created on cloudinary
  return await cloudinary.uploader.upload(file.tempFilePath,options)//used to upload file on cloudinary

}

// '/imageUpload' handler

exports.imageUpload=async(req,res)=>
{
    try{
    //1>data fetch from request
    const {name}=req.body 
    console.log('print name,email,tags ',name);

    const file=req.files.imageFile;//fetch the file from request
    console.log("file is ",file);

    // 2>validation
    const supportedTypes=['jpg','jpeg','png'];//these are supported type
    const fileType=file.name.split('.')[3].toLowerCase();//'jpg','png','jpeg' all are in lower case so for not taking any chance we will convert the file 
    // name which we will get from the request in to lowercase
    console.log('filetype is ',fileType);
    if(!isFileTypeSupported(fileType,supportedTypes))//agr fileType supported nhi hai
    {
      return res.status(400).json({
       success:false,
       message:"file format is not supported"
      })
    }
    //agr fileType supprted hai to oose cloudinary prr upload krna hai using upload()
    
         const response=await uploadFileToCloudinary(file,"image");//"image" is name of folder on cloudinary
          console.log("response is ",response);

        //   DB me entry save kro
        // const fileData=await File.create({
        //     name,
        //     tags,
        //     imageUrl,
        //     email
        // })

        res.json({
            success:true,
            message:"Image Successfully uploaded"
        })
    
    }
    catch(error)
    {
        console.log(`Error in imageUpload handler is ${error} `);
        res.status(400).json({
            success:false,
            message:"Something went Wrong"
        })
    }
}