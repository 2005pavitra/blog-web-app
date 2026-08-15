import mongoose from "mongoose";
import { Blog } from "../models/blogs.models.js";
import { Bookmark } from "../models/bookmark.models.js";
import { ReadingProgress } from "../models/readingProgress.models.js";
import { BlogView } from "../models/blogView.models.js";
import { Comment } from "../models/comments.models.js";
import { v2 as cloudinary } from "cloudinary";
import { isValidCategory } from "../constants/categories.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";
import { normalizeTags } from "../utils/tags.js";
import { calculateTrendingScore } from "../utils/trending.js";
import {
  buildUserInterestProfile,
  scoreBlogForUser,
} from "../utils/recommendations.js";
import { isAuthorOrAdmin } from "../middleware/authUser.js";
import { validateImageUpload } from "../utils/uploadValidation.js";
import { createNotification } from "../models/notification.models.js";

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  most_viewed: { totalViews: -1 },
  most_liked: { likeCount: -1 },
  most_commented: { commentCount: -1 },
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildDiscoveryFilter = (query, user = null) => {
  const filter = {};

  if (query.status && user?.role === "admin") {
    filter.status = query.status;
  } else if (query.mine === "true" && user) {
    filter.createdBy = user._id;
  } else {
    filter.status = BLOG_STATUS.PUBLISHED;
  }

  if (query.category && isValidCategory(query.category)) {
    filter.category = query.category;
  }

  if (query.tag) {
    filter.tags = query.tag.toLowerCase().trim();
  }

  if (query.author) {
    filter.adminName = new RegExp(query.author.trim(), "i");
  }

  if (query.search) {
    filter.$text = { $search: query.search.trim() };
  }

  return filter;
};

export const discoverBlogs = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildDiscoveryFilter(req.query, req.user);
    const sortKey = req.query.sort || "newest";

    let blogs;
    let total;

    if (sortKey === "trending") {
      const candidates = await Blog.find(filter).limit(200).lean();
      const scored = candidates
        .map((b) => ({ ...b, trendingScore: calculateTrendingScore(b) }))
        .sort((a, b) => b.trendingScore - a.trendingScore);
      total = scored.length;
      blogs = scored.slice(skip, skip + limit);
    } else {
      const sort = SORT_OPTIONS[sortKey] || SORT_OPTIONS.newest;
      [blogs, total] = await Promise.all([
        Blog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Blog.countDocuments(filter),
      ]);
    }

    return res.status(200).json({
      message: "Blogs retrieved successfully",
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("discoverBlogs error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllblogs = async (req, res) => {
  req.query.status = BLOG_STATUS.PUBLISHED;
  return discoverBlogs(req, res);
};

export const getTrendingBlogs = async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 10);
    const candidates = await Blog.find({ status: BLOG_STATUS.PUBLISHED })
      .limit(100)
      .lean();

    const trending = candidates
      .map((b) => ({ ...b, trendingScore: calculateTrendingScore(b) }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);

    return res.status(200).json({
      message: "Trending blogs retrieved",
      blogs: trending,
      formula: "views*1 + likes*3 + comments*2 + recencyBoost(max 50, decays 0.5/hr)",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecommendedBlogs = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 10);

    const [bookmarks, likedBlogs, readingRows] = await Promise.all([
      Bookmark.find({ userId }).populate("blogId").lean(),
      Blog.find({ likes: userId, status: BLOG_STATUS.PUBLISHED }).lean(),
      ReadingProgress.find({ userId }).populate("blogId").limit(30).lean(),
    ]);

    const signals = [];

    bookmarks.forEach((b) => {
      if (b.blogId) {
        signals.push({
          category: b.blogId.category,
          tagList: b.blogId.tags,
          authorId: b.blogId.createdBy,
          weight: 3,
        });
      }
    });

    likedBlogs.forEach((b) => {
      signals.push({
        category: b.category,
        tagList: b.tags,
        authorId: b.createdBy,
        weight: 2,
      });
    });

    readingRows.forEach((r) => {
      if (r.blogId) {
        signals.push({
          category: r.blogId.category,
          tagList: r.blogId.tags,
          authorId: r.blogId.createdBy,
          weight: 1,
        });
      }
    });

    req.user.interests?.forEach((interest) => {
      signals.push({ category: interest, tagList: [interest], weight: 2 });
    });

    const profile = buildUserInterestProfile(signals);

    const candidates = await Blog.find({
      status: BLOG_STATUS.PUBLISHED,
      createdBy: { $ne: userId },
    })
      .limit(150)
      .lean();

    const readBlogIds = new Set(
      readingRows.map((r) => r.blogId?._id?.toString()).filter(Boolean)
    );

    const recommended = candidates
      .filter((b) => !readBlogIds.has(b._id.toString()))
      .map((b) => ({
        ...b,
        recommendationScore: scoreBlogForUser(b, profile),
      }))
      .filter((b) => b.recommendationScore > 0)
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

    return res.status(200).json({
      message: "Recommended blogs retrieved",
      blogs: recommended,
      algorithm:
        "categoryMatch*5 + tagOverlap*3 + authorAffinity*2 + recencyBonus",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const isPrivate =
      blog.status !== BLOG_STATUS.PUBLISHED &&
      !isAuthorOrAdmin(blog, req.user);

    if (isPrivate) {
      return res.status(403).json({ error: "This blog is not publicly available" });
    }

    let isBookmarked = false;
    if (req.user) {
      const bookmark = await Bookmark.findOne({
        userId: req.user._id,
        blogId: blog._id,
      });
      isBookmarked = !!bookmark;
    }

    return res.status(200).json({
      message: "Blog retrieved successfully",
      blog,
      isBookmarked,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const trackBlogView = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.status !== BLOG_STATUS.PUBLISHED) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const viewerKey =
      req.user?._id?.toString() ||
      req.body?.sessionId ||
      req.ip ||
      "anonymous";

    const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existing = await BlogView.findOne({
      blogId: blog._id,
      viewerKey,
      viewedAt: { $gte: windowStart },
    });

    if (!existing) {
      await BlogView.create({ blogId: blog._id, viewerKey });
      blog.totalViews += 1;
      await blog.save();
    }

    return res.status(200).json({
      message: "View recorded",
      totalViews: blog.totalViews,
      counted: !existing,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, category, description, tags, status, publishAt } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ error: "Title, category, and description are required" });
    }
    if (!isValidCategory(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    let blogImageData = null;
    if (req.files?.blogImage) {
      if (!validateImageUpload(req.files.blogImage, res)) return;
      const upload = await cloudinary.uploader.upload(
        req.files.blogImage.tempFilePath
      );
      blogImageData = { public_id: upload.public_id, url: upload.secure_url };
    } else if (status !== BLOG_STATUS.DRAFT) {
      return res.status(400).json({ error: "Blog image is required for non-draft posts" });
    }

    let blogStatus = status || BLOG_STATUS.PUBLISHED;
    if (![BLOG_STATUS.DRAFT, BLOG_STATUS.PUBLISHED, BLOG_STATUS.SCHEDULED].includes(blogStatus)) {
      blogStatus = BLOG_STATUS.PUBLISHED;
    }

    if (blogStatus === BLOG_STATUS.SCHEDULED) {
      if (!publishAt || new Date(publishAt) <= new Date()) {
        return res.status(400).json({ error: "Scheduled posts require a future publishAt date" });
      }
    }

    const newBlog = await Blog.create({
      title,
      category,
      description,
      tags: normalizeTags(tags),
      adminName: req.user.name,
      createdBy: req.user._id,
      blogImage: blogImageData || { public_id: "draft", url: "" },
      status: blogStatus,
      publishAt: blogStatus === BLOG_STATUS.SCHEDULED ? new Date(publishAt) : null,
    });

    return res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("createBlog:", error.message);
    return res.status(500).json({ error: "Internal server error in creating blog" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (!isAuthorOrAdmin(blog, req.user)) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }

    const { title, category, description, tags, status, publishAt } = req.body;

    if (title) blog.title = title;
    if (category) {
      if (!isValidCategory(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }
      blog.category = category;
    }
    if (description) blog.description = description;
    if (tags !== undefined) blog.tags = normalizeTags(tags);

    if (req.files?.blogImage) {
      if (!validateImageUpload(req.files.blogImage, res)) return;
      const upload = await cloudinary.uploader.upload(
        req.files.blogImage.tempFilePath
      );
      if (blog.blogImage?.public_id && blog.blogImage.public_id !== "draft") {
        await cloudinary.uploader.destroy(blog.blogImage.public_id).catch(() => {});
      }
      blog.blogImage = { public_id: upload.public_id, url: upload.secure_url };
    }

    if (status && Object.values(BLOG_STATUS).includes(status)) {
      blog.status = status;
      if (status === BLOG_STATUS.SCHEDULED && publishAt) {
        blog.publishAt = new Date(publishAt);
      }
      if (status === BLOG_STATUS.PUBLISHED) {
        blog.publishAt = null;
      }
    }

    await blog.save();
    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    if (!isAuthorOrAdmin(blog, req.user)) {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }

    if (blog.blogImage?.public_id && blog.blogImage.public_id !== "draft") {
      await cloudinary.uploader.destroy(blog.blogImage.public_id).catch(() => {});
    }

    await Promise.all([
      blog.deleteOne(),
      Comment.deleteMany({ blogId: blog._id }),
      Bookmark.deleteMany({ blogId: blog._id }),
      ReadingProgress.deleteMany({ blogId: blog._id }),
    ]);

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const blogs = await Blog.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json({ message: "My blogs", blogs });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const publishBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (!isAuthorOrAdmin(blog, req.user)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    blog.status = BLOG_STATUS.PUBLISHED;
    blog.publishAt = null;
    await blog.save();

    return res.status(200).json({ message: "Blog published", blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const archiveBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (!isAuthorOrAdmin(blog, req.user)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    blog.status = BLOG_STATUS.ARCHIVED;
    await blog.save();
    return res.status(200).json({ message: "Blog archived", blog });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userId = req.user._id.toString();
    const isLiked = blog.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
      if (blog.createdBy && blog.createdBy.toString() !== userId) {
        await createNotification({
          recipientId: blog.createdBy,
          type: "like",
          message: `${req.user.name} liked your blog "${blog.title}"`,
          entityType: "blog",
          entityId: blog._id,
        });
      }
    }

    blog.likeCount = blog.likes.length;
    await blog.save();

    return res.status(200).json({
      message: isLiked ? "Blog unliked" : "Blog liked",
      isLiked: !isLiked,
      likeCount: blog.likeCount,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
