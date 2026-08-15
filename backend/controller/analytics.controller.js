import { User } from "../models/user.models.js";
import { Blog } from "../models/blogs.models.js";
import { Comment } from "../models/comments.models.js";
import { Report } from "../models/report.models.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";
import { REPORT_STATUS } from "../constants/reportReasons.js";
import { calculateTrendingScore } from "../utils/trending.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      scheduledBlogs,
      viewAgg,
      likeAgg,
      commentCount,
      pendingReports,
      categoryStats,
      topAuthors,
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ status: BLOG_STATUS.PUBLISHED }),
      Blog.countDocuments({ status: BLOG_STATUS.DRAFT }),
      Blog.countDocuments({ status: BLOG_STATUS.SCHEDULED }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$totalViews" } } }]),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$likeCount" } } }]),
      Comment.countDocuments(),
      Report.countDocuments({ status: REPORT_STATUS.PENDING }),
      Blog.aggregate([
        { $match: { status: BLOG_STATUS.PUBLISHED } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Blog.aggregate([
        { $match: { status: BLOG_STATUS.PUBLISHED, createdBy: { $ne: null } } },
        {
          $group: {
            _id: "$createdBy",
            blogCount: { $sum: 1 },
            totalLikes: { $sum: "$likeCount" },
            adminName: { $first: "$adminName" },
          },
        },
        { $sort: { blogCount: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const trendingCandidates = await Blog.find({
      status: BLOG_STATUS.PUBLISHED,
    })
      .limit(20)
      .lean();

    const trendingBlogs = trendingCandidates
      .map((b) => ({ ...b, trendingScore: calculateTrendingScore(b) }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);

    return res.status(200).json({
      totals: {
        users: totalUsers,
        blogs: totalBlogs,
        publishedBlogs,
        drafts: draftBlogs,
        scheduled: scheduledBlogs,
        views: viewAgg[0]?.total || 0,
        likes: likeAgg[0]?.total || 0,
        comments: commentCount,
        pendingReports,
      },
      popularCategories: categoryStats,
      topAuthors,
      trendingBlogs,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
