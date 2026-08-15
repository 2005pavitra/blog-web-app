import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    phone: { type: String, unique: true, sparse: true, trim: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    password: {
      type: String,
      select: false,
      minlength: 8,
    },
    photo: {
      public_id: { type: String },
      url: { type: String },
    },
    bio: { type: String, maxlength: 500, default: "" },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 15,
        message: "Maximum 15 interests allowed",
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const User = mongoose.model("User", userSchema);
export { User };
