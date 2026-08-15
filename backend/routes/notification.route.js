import express from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controller/notification.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/read-all", isAuthenticated, markAllNotificationsRead);
router.put("/:id/read", isAuthenticated, markNotificationRead);

export default router;
