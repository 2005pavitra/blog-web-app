import express from "express";
import {
  createReport,
  getReports,
  resolveReport,
} from "../controller/report.controller.js";
import { isAuthenticated, isAdmin } from "../middleware/authUser.js";

const router = express.Router();

router.post("/", isAuthenticated, createReport);
router.get("/", isAuthenticated, isAdmin, getReports);
router.put("/:id/resolve", isAuthenticated, isAdmin, resolveReport);

export default router;
