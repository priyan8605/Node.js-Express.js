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
async function uploadFileToCloudinary(file,folder,quality)
{

    const options={folder}//options is an object which represent "image" folder that we have created on cloudinary
    console.log(`temp file path is ${file.tempFilePath}`);
    if(quality)
    {
        // agr quality aa rha hai in parameter of function then if()
        options.quality=quality//then options me i.e image folder me quality include ho jayega
    }
    options.resource_type="auto";//it will decide which type of file to be uploaded "image" or "video"
    return await cloudinary.uploader.upload(file.tempFilePath,options)//used to upload file on cloudinary

}

// '/imageUpload' handler

exports.imageUpload=async(req,res)=>
{
    try{
    //1>data fetch from request
    const {name,email,tags}=req.body 
    console.log('print name,email,tags ',name,email,tags);

    const file=req.files.imageFile;//fetch the file from request
    console.log(`file is ${file}`);

    // 2>validation
    const supportedTypes=['jpg','jpeg','png'];//these are supported type
    const fileType=file.name.split('.')[3].toLowerCase();//'jpg','png','jpeg' all are in lower case so for not taking any chance we will convert the file 
    // name which we will get from the request in to lowercase
    console.log(`filetype is ${fileType}`);
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
        const fileData=await File.create({
            name,
            tags,
            imageUrl:response.secure_url,
            email
         })

        res.json({
            success:true,
            message:"Image Successfully uploaded",
            imageUrl:response.secure_url,
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


// video upload handler

exports.videoUpload=async(req,res)=>
{
    try
    {
    //1> fetch data from request
      const {name,tags,email}=req.body;
     console.log(`for video ${name}, ${tags }, ${ email}`);
     const file=req.files.videoFile;
     console.log(`name of file is ${file}`);

    //2> perform validation
    const supportedTypes=['mp4','mov'];
    const fileType=file.name.split('.')[1].toLowerCase();
    console.log(`file type is ${file}`);
    // adding upperlimit of 5mb for a video => 5b se jyada ka video upload nhi hoga



    if(!isFileTypeSupported(fileType,supportedTypes))
    {
        return res.status(400).json({
            success:false,
            message:"File format is not supported"
        })
    }
     //agr fileType supprted hai to oose cloudinary prr upload krna hai using upload()
    
     const response=await uploadFileToCloudinary(file,"image");//"image" is name of folder on cloudinary
     console.log("response is ",response);

   //   DB me entry save kro
   const fileData=await File.create({
       name,
       tags,
       videoUrl:response.secure_url,
       email,
    })

   res.json({
       success:true,
       message:"video Successfully uploaded",
       videoUrl:response.secure_url,
   })
    }
    catch(error)
    {
       console.log(`Error in videoUplopad handler ${error}`); 
        res.status(400).json({
            success:false,
            message:"Some error in videoUpload"
        })
    }
}


// imageSizeReducer handler==> ye imageSize ko compress krega then it will upload it on cloudinary
exports.imageSizeReducer=async(req,res)=>
{
    // here we are uploading 600kb photo from local machine which will be stored on cloudinary as 196 kb
    // becsause we are passing quality=30 in uploadFileToCloudinary(file,"image",30)
    try{
        //1>data fetch from request
        const {name,email,tags}=req.body 
        console.log('print name,email,tags ',name,email,tags);
    
        const file=req.files.imageFile;//fetch the file from request
        console.log(`file is ${file}`);
    
        // 2>validation
        const supportedTypes=['jpg','jpeg','png'];//these are supported type
        const fileType=file.name.split('.')[1].toLowerCase();//'jpg','png','jpeg' all are in lower case so for not taking any chance we will convert the file 
        // name which we will get from the request in to lowercase
        console.log(`filetype is ${fileType}`);
        if(!isFileTypeSupported(fileType,supportedTypes))//agr fileType supported nhi hai
        {
          return res.status(400).json({
           success:false,
           message:"file format is not supported"
          })
        }
        //agr fileType supprted hai to oose cloudinary prr upload krna hai using upload()
        
             const response=await uploadFileToCloudinary(file,"image",2);//"image" is name of folder on cloudinary
              console.log("response is ",response);
    
            //   DB me entry save kro
            const fileData=await File.create({
                name,
                tags,
                imageUrl:response.secure_url,
                email
             })
    
            res.json({
                success:true,
                message:"Image Successfully uploaded",
                imageUrl:response.secure_url,
            })
        
        }
        catch(error)
        {
            console.log(`Error in imageSizeReducer handler is ${error} `);
            res.status(400).json({
                success:false,
                message:"Something went Wrong"
            })
        }
}