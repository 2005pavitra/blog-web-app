import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import bodyParser from "body-parser";
import cors from "cors"
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
//middlware
app.use(express.json());
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"50mb", extended: true}));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//cloudinary

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

//routes
app.use("/api/users", userRouter);


const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;



try {
    mongoose.connect(MONGODB_URL, {
        
    })
    console.log("MongoDB connected successfully")
}catch(error){
    console.log("Error while connecting to MongoDB")
}



app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})