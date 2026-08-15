import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "comment",
        "reply",
        "like",
        "report_resolved",
        "blog_published",
        "warning",
      ],
      required: true,
    },
    message: { type: String, required: true },
    relatedEntity: {
      entityType: { type: String },
      entityId: { type: mongoose.Schema.Types.ObjectId },
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);

export const createNotification = async ({
  recipientId,
  type,
  message,
  entityType,
  entityId,
}) => {
  if (!recipientId) return null;
  return Notification.create({
    recipientId,
    type,
    message,
    relatedEntity: { entityType, entityId },
  });
};
