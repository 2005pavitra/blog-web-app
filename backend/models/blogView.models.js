import mongoose from "mongoose";

/** Dedup view counts: one view per viewerKey per blog per 24h window */
const blogViewSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    viewerKey: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

blogViewSchema.index({ blogId: 1, viewerKey: 1, viewedAt: -1 });

export const BlogView = mongoose.model("BlogView", blogViewSchema);
