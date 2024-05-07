const Category=require('../models/category')

// create a handler function for "Category"
// Note==>category sirf Admin bna skta hai
exports.createCategory=async(req,res)=>{
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
        const categoryDetails=await Category.create({
            name:name,
            description:description
        })
        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })



    }
    catch(error)
    {
        console.log(`Error in createCategory()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"Can't create a category"
        })
    }
}

// getAllCategory handler function 
exports.showAllCategory=async(req,res)=>{
    try{
       
        const allCategory=await Category.find({},{name:true,description:true});
         // find({}) koi criteria ke basis prr Category me se entry nhi layega 
        //  blki jitna bhi entry pda hai Category ke andr wo sbb lee krr aajayega 
        // just make sure one thing ki hrr ekk entry ke andr name and description
        //  hona hi chahiye =>Select name,description from  table Category
        res.status(200).json({
             success:true,
             message:"All Category returned successfully",
             allCategory
        });
        

    }
    catch(error)
    {
        console.log(`Error occured in showAllCategory()=> ${error}`);
        return res.status(500).json({
            success:false,
            message:"Can't show allCategory"
        })
    }
}