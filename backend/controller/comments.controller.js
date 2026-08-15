import mongoose from "mongoose";
import { Comment } from "../models/comments.models.js";
import { Blog } from "../models/blogs.models.js";
import { createNotification } from "../models/notification.models.js";

const buildCommentTree = (comments) => {
  const map = new Map();
  const roots = [];

  comments.forEach((c) => {
    map.set(c._id.toString(), { ...c.toObject(), replies: [] });
  });

  map.forEach((node) => {
    if (node.parentCommentId) {
      const parent = map.get(node.parentCommentId.toString());
      if (parent) parent.replies.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const addComment = async (req, res) => {
  try {
    const { blogId, content, parentCommentId } = req.body;

    if (!content?.trim() || !blogId) {
      return res.status(400).json({ error: "Content and blogId are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent || parent.blogId.toString() !== blogId) {
        return res.status(400).json({ error: "Invalid parent comment" });
      }
    }

    const newComment = await Comment.create({
      blogId,
      userId: req.user._id,
      userName: req.user.name,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    blog.commentCount = await Comment.countDocuments({ blogId });
    await blog.save();

    if (blog.createdBy && blog.createdBy.toString() !== req.user._id.toString()) {
      await createNotification({
        recipientId: blog.createdBy,
        type: parentCommentId ? "reply" : "comment",
        message: `${req.user.name} ${parentCommentId ? "replied to a comment on" : "commented on"} "${blog.title}"`,
        entityType: "blog",
        entityId: blog._id,
      });
    }

    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (
        parent &&
        parent.userId.toString() !== req.user._id.toString()
      ) {
        await createNotification({
          recipientId: parent.userId,
          type: "reply",
          message: `${req.user.name} replied to your comment`,
          entityType: "comment",
          entityId: parent._id,
        });
      }
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("addComment:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const flat = req.query.flat === "true";

    const comments = await Comment.find({ blogId })
      .sort({ createdAt: 1 })
      .populate("userId", "name username photo");

    if (flat) {
      return res.status(200).json({ message: "Comments retrieved", comments });
    }

    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments: buildCommentTree(comments),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized to update this comment" });
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    const toDelete = [comment._id];
    const replies = await Comment.find({ parentCommentId: comment._id });
    replies.forEach((r) => toDelete.push(r._id));

    await Comment.deleteMany({ _id: { $in: toDelete } });

    const blog = await Blog.findById(comment.blogId);
    if (blog) {
      blog.commentCount = await Comment.countDocuments({ blogId: blog._id });
      await blog.save();
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const replyToComment = async (req, res) => {
  req.body.parentCommentId = req.params.commentId;
  req.body.blogId = req.body.blogId || (await Comment.findById(req.params.commentId))?.blogId;
  return addComment(req, res);
};
