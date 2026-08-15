import express from "express";
import { getAdminAnalytics } from "../controller/analytics.controller.js";
import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAdminAnalytics);

export default router;
