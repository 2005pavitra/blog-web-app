import { Comment } from "../models/comments.models.js";

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    if (!content || !blogId) {
      return res.status(400).json({ error: "Content and blogId are required" });
    }

    const newComment = new Comment({
      blogId,
      userId,
      userName,
      content
    });

    await newComment.save();

    res.status(201).json({ 
      message: "Comment added successfully", 
      comment: newComment 
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get comments for a blog
export const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId })
      .sort({ createdAt: -1 }) // Most recent first
      .populate('userId', 'name');

    res.status(200).json({ 
      message: "Comments retrieved successfully", 
      comments 
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized to update this comment" });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();

    res.status(200).json({ 
      message: "Comment updated successfully", 
      comment 
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user owns the comment or is admin
    if (comment.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ 
      message: "Comment deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 