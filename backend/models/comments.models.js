import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

commentSchema.index({ blogId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

commentSchema.pre("save", function updateTimestamp(next) {
  this.updatedAt = Date.now();
  next();
});

export const Comment = mongoose.model("Comment", commentSchema);
