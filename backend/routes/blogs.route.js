import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllblogs,
  updateBlog,
  getMyBlogs,
  getSingleBlog,
  toggleLike,
  discoverBlogs,
  getTrendingBlogs,
  getRecommendedBlogs,
  trackBlogView,
  publishBlog,
  archiveBlog,
} from "../controller/blogs.controller.js";
import {
  addBookmark,
  removeBookmark,
  getBookmarkStatus,
} from "../controller/bookmark.controller.js";
import {
  updateReadingProgress,
} from "../controller/readingProgress.controller.js";
import {
  isAuthenticated,
  isAdmin,
  optionalAuth,
} from "../middleware/authUser.js";

const router = express.Router();

// Static paths BEFORE /:id
router.get("/discover", optionalAuth, discoverBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/recommended", isAuthenticated, getRecommendedBlogs);
router.get("/allblogs", optionalAuth, getAllblogs);
router.get("/my-blogs", isAuthenticated, getMyBlogs);
router.get("/admin/my-blogs", isAuthenticated, getMyBlogs);
router.get("/admin/:id", isAuthenticated, isAdmin, getMyBlogs);

router.post("/create", isAuthenticated, createBlog);
router.put("/update/:id", isAuthenticated, updateBlog);
router.delete("/delete/:id", isAuthenticated, deleteBlog);

router.post("/like/:id", isAuthenticated, toggleLike);
router.post("/:id/view", optionalAuth, trackBlogView);
router.post("/:id/publish", isAuthenticated, publishBlog);
router.post("/:id/archive", isAuthenticated, archiveBlog);
router.post("/:id/bookmark", isAuthenticated, addBookmark);
router.delete("/:id/bookmark", isAuthenticated, removeBookmark);
router.get("/:id/bookmark-status", isAuthenticated, getBookmarkStatus);

router.put("/:id/progress", isAuthenticated, updateReadingProgress);

router.get("/:id", optionalAuth, getSingleBlog);

export default router;
