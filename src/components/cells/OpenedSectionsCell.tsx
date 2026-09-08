import { sections } from "@/presets/content";
import { useExpandedSections } from "@/hooks/useExpandedSections";
import { scrollToHeading } from "@/lib/scrollToHeading";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
}

const ITEM_CLASS =
  "cursor-pointer font-heading text-[13px] text-black opacity-80 transition-opacity hover:opacity-100";

export function OpenedSectionsCell() {
  const { expanded } = useExpandedSections();
  const opened = expanded.flatMap((id) => {
    const section = sections.find((candidate) => candidate.id === id);
    return section?.heading ? [{ id: section.id, heading: section.heading }] : [];
  });

  return (
    <ul className="flex flex-row flex-wrap gap-4 md:flex-col">
      {opened.map((section) => (
        <li key={section.id} className="animate-fade-in">
          <button type="button" onClick={() => scrollToHeading(section.id)} className={ITEM_CLASS}>
            {section.heading}
          </button>
        </li>
      ))}
      {opened.length > 0 && (
        <li className="animate-fade-in md:hidden">
          <button type="button" onClick={scrollToTop} className={ITEM_CLASS}>
            Top
          </button>
        </li>
      )}
    </ul>
  );
}
