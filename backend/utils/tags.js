export const normalizeTags = (tagsInput) => {
  if (!tagsInput) return [];

  const raw = Array.isArray(tagsInput)
    ? tagsInput
    : String(tagsInput).split(",");

  const normalized = raw
    .map((tag) => String(tag).trim().toLowerCase())
    .filter((tag) => tag.length > 0 && tag.length <= 30);

  return [...new Set(normalized)].slice(0, 10);
};
