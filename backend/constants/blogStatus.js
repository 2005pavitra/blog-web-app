export const BLOG_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  SCHEDULED: "SCHEDULED",
  ARCHIVED: "ARCHIVED",
};

export const BLOG_STATUS_VALUES = Object.values(BLOG_STATUS);

export const isValidBlogStatus = (status) => BLOG_STATUS_VALUES.includes(status);
