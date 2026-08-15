import express from "express";
import { login, register, logout } from "../controller/user.controller.js";
import {
  getUserProfile,
  updateUserProfile,
  getCurrentUser,
} from "../controller/profile.controller.js";
import { getUserBookmarks } from "../controller/bookmark.controller.js";
import {
  getContinueReading,
  getRecentlyRead,
  getUserActivity,
} from "../controller/readingProgress.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/profile/:id", isAuthenticated, getUserProfile);
router.put("/profile", isAuthenticated, updateUserProfile);
router.get("/bookmarks", isAuthenticated, getUserBookmarks);
router.get("/activity", isAuthenticated, getUserActivity);
router.get("/continue-reading", isAuthenticated, getContinueReading);
router.get("/recently-read", isAuthenticated, getRecentlyRead);

export default router;
