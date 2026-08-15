import { Report } from "../models/report.models.js";
import { Blog } from "../models/blogs.models.js";
import { Comment } from "../models/comments.models.js";
import { User } from "../models/user.models.js";
import { REPORT_STATUS } from "../constants/reportReasons.js";
import { REPORT_REASONS } from "../constants/reportReasons.js";
import { createNotification } from "../models/notification.models.js";

export const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ error: "targetType, targetId, and reason are required" });
    }
    if (!REPORT_REASONS.includes(reason)) {
      return res.status(400).json({ error: "Invalid report reason" });
    }

    const report = await Report.create({
      reporterId: req.user._id,
      targetType,
      targetId,
      reason,
      details: details || "",
    });

    return res.status(201).json({ message: "Report submitted", report });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "You have already reported this content",
      });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getReports = async (req, res) => {
  try {
    const status = req.query.status || REPORT_STATUS.PENDING;
    const reports = await Report.find({ status })
      .sort({ createdAt: -1 })
      .populate("reporterId", "name email")
      .populate("resolvedBy", "name");

    return res.status(200).json({ message: "Reports retrieved", reports });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { action, adminNote } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (action === "dismiss") {
      report.status = REPORT_STATUS.REJECTED;
    } else if (action === "resolve") {
      report.status = REPORT_STATUS.RESOLVED;
    } else if (action === "remove_content") {
      report.status = REPORT_STATUS.RESOLVED;
      if (report.targetType === "blog") {
        await Blog.findByIdAndDelete(report.targetId);
      } else if (report.targetType === "comment") {
        await Comment.findByIdAndDelete(report.targetId);
      }
    } else if (action === "warn_user" && report.targetType === "user") {
      report.status = REPORT_STATUS.RESOLVED;
      await createNotification({
        recipientId: report.targetId,
        type: "warning",
        message: adminNote || "Your content was reported and reviewed by moderators.",
        entityType: "user",
        entityId: report.targetId,
      });
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    report.adminNote = adminNote || "";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    await report.save();

    await createNotification({
      recipientId: report.reporterId,
      type: "report_resolved",
      message: `Your report has been ${report.status}`,
      entityType: "report",
      entityId: report._id,
    });

    return res.status(200).json({ message: "Report updated", report });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
