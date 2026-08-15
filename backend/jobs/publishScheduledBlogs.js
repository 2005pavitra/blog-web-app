/**
 * Scheduled publishing job architecture:
 *
 * Uses node-cron to run every minute (not a busy loop).
 * On server start, also runs once to catch missed publishes after restart.
 *
 * Finds blogs where status=SCHEDULED and publishAt <= now,
 * atomically updates them to PUBLISHED.
 */
import cron from "node-cron";
import { Blog } from "../models/blogs.models.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";
import { createNotification } from "../models/notification.models.js";

export const publishDueScheduledBlogs = async () => {
  const now = new Date();
  const dueBlogs = await Blog.find({
    status: BLOG_STATUS.SCHEDULED,
    publishAt: { $lte: now },
  });

  for (const blog of dueBlogs) {
    blog.status = BLOG_STATUS.PUBLISHED;
    blog.publishAt = null;
    await blog.save();

    if (blog.createdBy) {
      await createNotification({
        recipientId: blog.createdBy,
        type: "blog_published",
        message: `Your scheduled blog "${blog.title}" is now live!`,
        entityType: "blog",
        entityId: blog._id,
      });
    }
  }

  if (dueBlogs.length > 0) {
    console.log(`Published ${dueBlogs.length} scheduled blog(s)`);
  }
};

export const startScheduler = () => {
  publishDueScheduledBlogs().catch((err) =>
    console.error("Initial scheduler run failed:", err.message)
  );

  cron.schedule("* * * * *", () => {
    publishDueScheduledBlogs().catch((err) =>
      console.error("Scheduler error:", err.message)
    );
  });

  console.log("Scheduled publish job started (runs every minute)");
};
