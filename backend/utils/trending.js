/**
 * Trending score formula (interview doc):
 *
 * trendingScore =
 *   (views * 1.0) +
 *   (likes * 3.0) +
 *   (comments * 2.0) +
 *   recencyBoost
 *
 * recencyBoost = max(0, 50 - ageInHours * 0.5)
 *   → fresh posts get up to +50; decays ~0.5 per hour over ~4 days.
 *
 * Time: O(1) per blog. Space: O(1).
 * Scale: compute at query time or cache in Redis for hot feeds.
 */
export const calculateTrendingScore = (blog, now = Date.now()) => {
  const views = blog.totalViews || 0;
  const likes = blog.likeCount ?? blog.likes?.length ?? 0;
  const comments = blog.commentCount || 0;

  const createdAt = blog.createdAt ? new Date(blog.createdAt).getTime() : now;
  const ageInHours = Math.max(0, (now - createdAt) / (1000 * 60 * 60));
  const recencyBoost = Math.max(0, 50 - ageInHours * 0.5);

  return views * 1.0 + likes * 3.0 + comments * 2.0 + recencyBoost;
};
