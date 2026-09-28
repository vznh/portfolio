import { writeFile } from "node:fs/promises";
import { substack } from "@vznh/substack";
import { format } from "prettier";

const newsletter = substack.newsletter("https://venh.substack.com");
const posts = await newsletter.get_posts("new");
const publications = await Promise.all(
  posts.map(async (post) => {
    const [name, canonicalUrl] = await Promise.all([post.get_title(), post.get_canonical_url()]);
    const url = new URL(canonicalUrl);
    if (!name.trim() || url.protocol !== "https:" || url.hostname !== "venh.substack.com") {
      throw new Error("Substack returned an invalid publication.");
    }
    return { name, url: url.href };
  }),
);

if (!publications.length) throw new Error("Substack returned no publications; keeping the saved list.");

await writeFile(
  new URL("../src/presets/publications.json", import.meta.url),
  await format(JSON.stringify(publications), { parser: "json" }),
);
console.log(`Updated ${publications.length} publications.`);
