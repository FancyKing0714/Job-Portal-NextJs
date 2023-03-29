import ConnectDB from '@/DB/connectDB';
import bookMarkJob from '@/models/Bookmark';
import Joi from 'joi';


const schema = Joi.object({
    user: Joi.required(),
    job: Joi.required(),
});


export default async (req, res) => {
    await ConnectDB();
    switch (req.method) {
        case "POST":
            await bookmark_my_job(req , res)
            break;
        case "GET":
            await getBookmark_jobs(req , res)
            break;
        case "DELETE":
            
            break;
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}



export const  bookmark_my_job = async (req, res) => {
    await ConnectDB();
    const data = req.body;
    const { job , user } = data;
    
    const { error } = schema.validate({job , user});

    if (error) return res.status(401).json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

    try {
        const checkAlreadyBookMarked  =  await bookMarkJob.findOne({job , user})
        if(checkAlreadyBookMarked) return res.status(401).json({success  :  false , message  : "This Job is Already in Bookmark"})

        const bookmarkingJob =  await bookMarkJob.create({job , user});
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !" })
    } catch (error) {
        console.log('Error in booking marking a job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}


export const getBookmark_jobs = async ( req , res) => {
    const userId = req.query.id;
    
    if(!userId) return res.status(400).json({ success: false, message: "Please Login" })
    try {
        const getBookMark = await bookMarkJob.find({user : userId }).populate('job').populate('user')
        return res.status(200).json({ success: true, message: "Job Bookmarked successfully !"  , data : getBookMark})
    } catch (error) {
        console.log('Error in getting book mark Job (server) => ', error);
        return res.status(500).json({ success: false, message: "Something Went Wrong Please Retry Later !" })
    }
}
