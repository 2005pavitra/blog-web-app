import mongoose from "mongoose";
import validator from "validator";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        // required: true,
        unique: true,
        validator: [validator.isEmail, "Please enter a valid email"]
    },
    phone:{
        type: Number,
        // required: true,
        unique: true,
    },
    role:{
        type: String,
        default: "user",
        enum: ["user", "admin"],
        // required: true,
    },
    password:{
        type: String,
        // required: true,
        select:false,
        minlength: 8,
    },

    photo:{
        public_id:{
            type:String,
            // required: true
        },
        url:{
            type:String,
            // required:true
        }

    },
    token:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User", userSchema);
export {User}
