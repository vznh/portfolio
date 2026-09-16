export function isContentFragment(hash: string, isContentId: (id: string) => boolean) {
  let id: string;
  try {
    id = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return false;
  }
  if (!id || id === "crossword") return false;
  return id === "content" || isContentId(id);
}
