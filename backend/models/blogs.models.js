import mongoose from "mongoose";
import { BLOG_CATEGORIES } from "../constants/categories.js";
import { BLOG_STATUS_VALUES, BLOG_STATUS } from "../constants/blogStatus.js";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the title of the blog"],
      trim: true,
      maxlength: 200,
    },
    blogImage: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    category: {
      type: String,
      required: [true, "Please select the category"],
      enum: {
        values: BLOG_CATEGORIES,
        message: "Invalid category",
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: "Maximum 10 tags allowed",
      },
    },
    description: {
      type: String,
      required: [true, "Please enter the description of the blog"],
      trim: true,
    },
    adminName: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: (v) => !v || mongoose.Types.ObjectId.isValid(v),
        message: (props) => `${props.value} is not a valid ObjectId`,
      },
    },
    status: {
      type: String,
      enum: BLOG_STATUS_VALUES,
      default: BLOG_STATUS.PUBLISHED,
    },
    publishAt: { type: Date, default: null },
    totalViews: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likeCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdBy: 1 });
blogSchema.index({ totalViews: -1 });
blogSchema.index({ likeCount: -1 });
blogSchema.index({ commentCount: -1 });
blogSchema.index({ title: "text", description: "text", tags: "text" });
blogSchema.index({ status: 1, publishAt: 1 });

blogSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = Date.now();
  next();
});

export const Blog = mongoose.model("Blog", blogSchema);
