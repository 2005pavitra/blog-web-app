import { Bookmark } from "../models/bookmark.models.js";
import { Blog } from "../models/blogs.models.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";

export const addBookmark = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.status === BLOG_STATUS.ARCHIVED) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { userId: req.user._id, blogId: blog._id },
      { $setOnInsert: { createdAt: new Date() } },
      { upsert: true, new: true }
    );

    return res.status(201).json({ message: "Blog bookmarked", bookmark });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Already bookmarked" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      userId: req.user._id,
      blogId: req.params.id,
    });
    return res.status(200).json({ message: "Bookmark removed" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "blogId",
        match: { status: { $ne: BLOG_STATUS.ARCHIVED } },
      });

    const blogs = bookmarks
      .map((b) => b.blogId)
      .filter(Boolean);

    return res.status(200).json({ message: "Bookmarks retrieved", blogs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookmarkStatus = async (req, res) => {
  try {
    const exists = await Bookmark.exists({
      userId: req.user._id,
      blogId: req.params.id,
    });
    return res.status(200).json({ isBookmarked: !!exists });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
