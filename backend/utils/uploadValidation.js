const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageUpload = (file, res) => {
  if (!file) {
    res.status(400).json({ error: "Image file is required" });
    return false;
  }

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    res.status(400).json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP" });
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    res.status(400).json({ error: "Image must be under 5MB" });
    return false;
  }

  return true;
};

export { MAX_IMAGE_SIZE };
