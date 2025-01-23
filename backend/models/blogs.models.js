import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Please enter the title of the blog"],

    },
    blogImage:{
        type:String,
        
    },
    category:{
        type:String,
        required: [true,"Please select the category"]
    },
   
    description:{
        type:String,
        required:[true, "Please enter the description of the blog"],
        trim: true,
        minlength:[100, "Description must be at least 100 characters"]
    },
    adminName:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }


})

export default mongoose.model("Blog", blogSchema)

