import { User } from "../models/user.models.js";
import { Blog } from "../models/blogs.models.js";
import { BLOG_STATUS } from "../constants/blogStatus.js";
import { v2 as cloudinary } from "cloudinary";
import { validateImageUpload } from "../utils/uploadValidation.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const publishedBlogs = await Blog.find({
      createdBy: user._id,
      status: BLOG_STATUS.PUBLISHED,
    })
      .sort({ createdAt: -1 })
      .select("-description");

    const likesReceived = await Blog.aggregate([
      { $match: { createdBy: user._id } },
      { $group: { _id: null, total: { $sum: "$likeCount" } } },
    ]);

    const isOwnProfile =
      req.user && req.user._id.toString() === user._id.toString();

    const profile = {
      _id: user._id,
      name: user.name,
      username: user.username,
      photo: user.photo,
      bio: user.bio,
      interests: user.interests,
      joinedDate: user.createdAt,
      publishedBlogs,
      totalLikesReceived: likesReceived[0]?.total || 0,
    };

    if (!isOwnProfile) {
      delete profile.interests;
    }

    return res.status(200).json({ profile, isOwnProfile });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, username, bio, interests } = req.body;

    if (name) user.name = name.trim();
    if (username) {
      const taken = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (taken) {
        return res.status(409).json({ error: "Username already taken" });
      }
      user.username = username.toLowerCase().trim();
    }
    if (bio !== undefined) user.bio = bio.slice(0, 500);
    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests.slice(0, 15)
        : String(interests).split(",").map((i) => i.trim()).slice(0, 15);
    }

    if (req.files?.photo) {
      if (!validateImageUpload(req.files.photo, res)) return;
      const upload = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath
      );
      if (user.photo?.public_id) {
        await cloudinary.uploader.destroy(user.photo.public_id).catch(() => {});
      }
      user.photo = { public_id: upload.public_id, url: upload.secure_url };
    }

    user.updatedAt = Date.now();
    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        photo: user.photo,
        bio: user.bio,
        interests: user.interests,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
