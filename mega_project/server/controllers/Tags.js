const Tag=require('../models/tags')

// create a handler function for "Tag"
exports.createTag=async(req,res)=>{
    try{
        // 1>fetch name,description from req.body
        const {name,description}=req.body;

        // 2>perform validation on fetched data
        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // 3>create entry in DB
        const tagDetails=await Tag.create({
            name:name,
            description:description
        })
        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })



    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:`${error} in createTag() handler`
        })
    }
}

// getAllTags handler function 
exports.showAllTags=async(req,res)=>{
    try{
       
        const allTags=await Tag.find({},{name:true,description:true});
         // find({}) koi criteria ke basis prr Tag me se entry nhi layega 
        //  blki jitna bhi entry pda hai Tag ke andr wo sbb lee krr aajayega 
        // just make sure one thing ki hrr ekk entry ke andr name and description
        //  hona hi chahiye =>Select name,description from  table Tag
        res.status(200).json({
             success:true,
             message:"All tags returned successfully",
             allTags
        });
        

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:`${error} occured in showAllTags`
        })
    }
}