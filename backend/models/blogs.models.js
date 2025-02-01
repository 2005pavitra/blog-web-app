import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Please enter the title of the blog"],

    },
    blogImage:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
        
    },
    category:{
        type:String,
        required: [true,"Please select the category"]
    },
   
    description:{
        type:String,
        required:[true, "Please enter the description of the blog"],
        trim: true,
        // minlength:[100, "Description must be at least 100 characters"]
    },
    adminName:{
        type:String,
        // required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        // required:true,
        validate: {
            validator: function(v) {
                return mongoose.Types.ObjectId.isValid(v);
            },
            message: props => `${props.value} is not a valid ObjectId`
        }
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

export const Blog = mongoose.model("Blog", blogSchema)

