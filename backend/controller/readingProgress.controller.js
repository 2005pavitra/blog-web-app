import { ReadingProgress } from "../models/readingProgress.models.js";
import { Blog } from "../models/blogs.models.js";
import { Bookmark } from "../models/bookmark.models.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";

const MAX_HISTORY = 50;

export const updateReadingProgress = async (req, res) => {
  try {
    const { progressPercent } = req.body;
    const percent = Math.min(100, Math.max(0, Number(progressPercent) || 0));

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const progress = await ReadingProgress.findOneAndUpdate(
      { userId: req.user._id, blogId: blog._id },
      { progressPercent: percent, lastReadAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Progress saved", progress });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getContinueReading = async (req, res) => {
  try {
    const items = await ReadingProgress.find({
      userId: req.user._id,
      progressPercent: { $gt: 0, $lt: 100 },
    })
      .sort({ lastReadAt: -1 })
      .limit(10)
      .populate("blogId");

    const blogs = items
      .filter((i) => i.blogId && i.blogId.status === BLOG_STATUS.PUBLISHED)
      .map((i) => ({
        blog: i.blogId,
        progressPercent: i.progressPercent,
        lastReadAt: i.lastReadAt,
      }));

    return res.status(200).json({ message: "Continue reading", items: blogs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecentlyRead = async (req, res) => {
  try {
    const items = await ReadingProgress.find({ userId: req.user._id })
      .sort({ lastReadAt: -1 })
      .limit(MAX_HISTORY)
      .populate("blogId");

    const blogs = items
      .map((i) => i.blogId)
      .filter((b) => b && b.status === BLOG_STATUS.PUBLISHED);

    return res.status(200).json({ message: "Recently read", blogs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const [continueItems, recent, bookmarks, likedBlogs] = await Promise.all([
      ReadingProgress.find({
        userId,
        progressPercent: { $gt: 0, $lt: 100 },
      })
        .sort({ lastReadAt: -1 })
        .limit(5)
        .populate("blogId"),
      ReadingProgress.find({ userId })
        .sort({ lastReadAt: -1 })
        .limit(10)
        .populate("blogId"),
      Bookmark.find({ userId }).sort({ createdAt: -1 }).limit(10).populate("blogId"),
      Blog.find({ likes: userId, status: BLOG_STATUS.PUBLISHED })
        .sort({ updatedAt: -1 })
        .limit(10),
    ]);

    return res.status(200).json({
      message: "User activity",
      continueReading: continueItems
        .filter((i) => i.blogId)
        .map((i) => ({
          blog: i.blogId,
          progressPercent: i.progressPercent,
        })),
      recentlyRead: recent.map((i) => i.blogId).filter(Boolean),
      bookmarked: bookmarks.map((b) => b.blogId).filter(Boolean),
      liked: likedBlogs,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
