// razorpay ka jo configuration hai that we have written in razorpay.js in config folder

const {instance}=require('../config/razorpay')
const Course=require('../models/Course')
const User=require('../models/User')
const mailSender=require('../utils/mailSender')
const {courseEnrollmentEmail}=require('../mail/templates/courseEnrollment');// import krr rhe hai kyu ki hume courseEnrollment ka mail bhej rhe hai
const { default: mongoose } = require('mongoose')


// capture the payment and initiate the razorpay payment
exports.capturePayment=async(req,res)=>
{
    try
    {
        // course kaun buy krr rha hai mtlb userId and kaunsa course buy krr rhaa hai mtlb courseId ye hume pta hona chahiye

        // 1>fetch courseId and userId
        const {course_id}=req.body 
        const userId=req.user.id

        // 2>perform validation

        // a>check courseId is valid or not
        if(!course_id)
        {
            return res.json({
                success:false,
                message:"Please Provide valid courseID"
            })
        }

        // b>check courseDetail coming from course_id is valid or not
        let course
        try
        {
            course=await Course.findById(course_id);//course_id ke help se course ka data or detail mil jayega
            if(!course)
            {
                return res.json({
                    success:false,
                    message:"Could not find the Course"
                })
            }

            //c>check whether user have already paid for this course or not
            // user ki id userId hum request se le hi rhe hai and userId is in string format
            // Course model me user ki id  objectId ke form me stored hai
            // studentsEnrolled:[{ type:mongoose.Schema.Types.ObjectId, ref:"User",required:true}]
            //  so we will convert userId from string to objectId
            const uid =new mongoose.Types.ObjectId.createFromHexString(userId) //convert userID from string to ObjectId
            if(course.studentsEnrolled.includes(uid))
            {
                // course me jo studentsEnrolled hai oosme agr pahle se pda hoga user ka objectId(i.e uid)
                return res.json({
                    success:false,
                    message:"Student is already enrolled for the course"
                })

            }


        }
        catch(error)
        {
            console.log(`Error in capturePayment() validation==>${error}`);
            return res.status(500).json({
                success:false,
               error:error.message
            })
        }

        // 3>create order
        // Course model me "price:{ } defined hai" courseDetail me amount hogs to wha se fetch krr lenge "course.price"
         const amount=await course.price;
         const currency="INR";

         const options={
            // jo bhi course ka actual amount hoga oose 100 se multiply krna must  hai for razorpay payment
            amount:amount*100,//must
            currency,//must
            receipt:Math.random(Date.now()).toString(),//optional
            notes:{
                courseId:course_id,
                userId
            }
         }

         try
         {
          //initiate the payment using razorpay
          const paymentResponse=await instance.orders.create(options);//will create an order
          console.log(paymentResponse);

        //   response
        res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            //agr humne order diya aur hum check krna chahta hai ki order ka status kya hai
            // kya order out for delivery hai ya  vo mumbai me hai ya haryana me hai to know this we need orderId
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })
         }
         catch(error)
         {
            console.log(`Error in  capturePayment() while initiating payment==>${error}`);
            return res.status(500).json({
                success:false,
                message:"Couldn't initiate payment",
               error:error.message
            })

         }
        // 4>return response

        return res.status(200).json({
            success:true,
            message:"Payment Captured Successfully",
           
        })
    }
        catch(error)
        {
           console.log(`Error in capturePayment()==>${error}`);
           return res.status(500).json({
               success:false,
               message:"Failed to Capture Payment",
              error:error.message
           })
        }
    
}

// verify Signature of Razorpay and server(backend)
exports.verifySignature=async(req,res)=>
{
    try
    {
        // server ke andr jo secret pda hai vo secret and razorpay ne jo secret bheja hai vo secret hume match krna hai
        const webhookSecret='12345678';//secret present in the server

        const signature=req.headers["x-razorpay-signature"];//razorpay ka signature server req ke header me se nikalega 
        // and "x-razorpay-signature" is a predefined key for razorpay-signature
        const shasum=crypto.createHmac("sha256",webhookSecret);//"sha256" is algo and "webhookSecret=12345678" is a secret key given to hmac
        // "const=shasum" is hmac object 
        // Hmac means hash based message authentication code =>it requires hashing algorithm and secret key
        // so HMAC works on top of hashing algorithm
        // sha full form :- secure hashing algorithm is used to convert data into a encrypted format and it doesn't require anything
        // SHA and HMAC both does the same thing which is to check the authenticity and integrity of a message their is only
        // one difference that HMAC requires a secret_key whereas SHA doesn't requires anything
        // client ne message bheja abb hum server prr verify krr rhe hai ki jo message aaya hai vo client ne jo bheja hai whi hai ya doosra 
        // in short we server is checking the authenticity of a message that came to it by a client
        
        // convert "shasum" hmac object into String
        shasum.update(JSON.stringify(req.body));//"shasum" converted to string
        const digest=shasum.digest('hex')//will convert "shasum" String into hexadecimal to protect data

        // match digest and signature
        if(signature===digest)
        {
            console.log("Payment is authorized");


            const{courseId,userId}=req.body.payload.entity.notes;//testing krne time ye dekhenge
            // capturePayment() me "options" variable ke andr "notes" ke andr "userId" ,"courseId" humne bheja hai
            try
            {
                // perform action

    //  payment authorized hone ke baad abb koi action hona chahiye
// "Action" ye hai ki user ko course me enroll krwao 
// User ko course me agr enroll krwa rhe hai mtlb User modal ke "courses" property me jis course ke liye enroll ho rha hai 
// oos particular course ka ObjectId store krwao  
// ya to Course model ke "studentsEnrolled" me oos particular user ka Object id daalo

                // find the course and enroll the student in it
                const enrolledCourse=await Course.findOneAndUpdate(
                    {
                        _id:courseId
                        // course find krr liya using courseId
                    },
                    {
                        $push:{studentsEnrolled:userId}
                        // Course model ke "studentsEnrolled" property me "userId" vo jo 
                        // course me enroll ho rha hai ooska id push krr denge
                    },
                    {
                        new:true
                      //will give updated document in the response
                    }
                );

                // validate response
                if(!enrolledCourse)
                {
                    return res.status(500).json({
                        success:false,
                        message:"Course not found"
                    })
                }
                console.log(`enrolledCourse===${enrolledCourse}`);

                // find the student and  and add him in the course
                 const enrolledStudent=await User.findOneAndUpdate(
                    {
                        _id:userId
                        // userId ke help se Student ko find kro
                    },
                    {
                        $push:{courses:courseId}
                        // User model ke "courses" property me "courseId" push krr denge
                    },
                    {
                        new:true
                        // 
                    }
                )
                console.log(`enrolledStudent === ${enrolledStudent}`)

                // send confirmation mail to the student 
                const emailResponse=await mailSender(
                    enrolledStudent.email,//email of student who enrolled for course
                    "Congratulation from codeHelp",//title
                    courseEnrollmentEmail(
                        enrolledCourse.courseName,
                        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                      )
                )
                console.log(`emailResponse => ${emailResponse}`);
                return res.status(200).json({
                  success:true,
                  message:"Signature verified and Course added"
                })
            }
            catch(error)
            {
                console.log(`Error in verifySignature() => ${error}`);
                return res.status(500).json({
                    success:false,
                    message:error.message
                })
                
            }
        }
        else
        {
            // when signature do not matches "digest"
            return res.status(400).json({
                success:false,
                message:"Invalid request"
            })

        }

    }
    catch(error)
    {
        console.log(`Error in capturePayment()==>${error}`);
        return res.status(500).json({
            success:false,
            message:"Failed to Capture Payment",
           error:error.message
        })
    }
}


