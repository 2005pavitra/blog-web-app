/**
 * Content-based recommendation (explainable, deterministic):
 *
 * For each candidate blog, score =
 *   categoryMatch * 5 +
 *   tagOverlap * 3 +
 *   authorAffinity * 2 +
 *   recencyBonus (up to 2)
 *
 * User interest profile built from:
 * - categories/tags of bookmarked blogs
 * - categories/tags of liked blogs
 * - categories/tags from reading history (weight 1)
 */
export const buildUserInterestProfile = (signals) => {
  const categories = {};
  const tags = {};
  const authors = {};

  const addWeight = (map, key, weight) => {
    if (!key) return;
    map[key] = (map[key] || 0) + weight;
  };

  signals.forEach(({ category, tagList, authorId, weight }) => {
    addWeight(categories, category, weight);
    tagList?.forEach((tag) => addWeight(tags, tag, weight));
    addWeight(authors, authorId?.toString(), weight);
  });

  return { categories, tags, authors };
};

export const scoreBlogForUser = (blog, profile, now = Date.now()) => {
  let score = 0;

  score += (profile.categories[blog.category] || 0) * 5;

  const blogTags = blog.tags || [];
  blogTags.forEach((tag) => {
    score += (profile.tags[tag] || 0) * 3;
  });

  score += (profile.authors[blog.createdBy?.toString()] || 0) * 2;

  const ageInDays =
    (now - new Date(blog.createdAt || now).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 2 - ageInDays * 0.05);

  return score;
};
