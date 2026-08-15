import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastReadAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

readingProgressSchema.index({ userId: 1, blogId: 1 }, { unique: true });
readingProgressSchema.index({ userId: 1, lastReadAt: -1 });

export const ReadingProgress = mongoose.model(
  "ReadingProgress",
  readingProgressSchema
);
