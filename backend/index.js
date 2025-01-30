import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import bodyParser from "body-parser";
import cors from "cors"

dotenv.config();
//middlware
app.use(express.json());
app.use(bodyParser.json({limit: "50mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"50mb", extended: true}));
app.use(cors());



const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;



try {
    mongoose.connect(MONGODB_URL, {
        
    })
    console.log("MongoDB connected successfully")
}catch(error){
    console.log("Error while connecting to MongoDB")
}

app.get("/", (req, res)=>{
    res.send("Blog web app");
}) 

//routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})