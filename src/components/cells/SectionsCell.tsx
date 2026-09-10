import { sections } from "@/presets/content";
import { handleSectionLinkClick } from "@/lib/scrollToHeading";

const ITEM_CLASS = "font-heading text-[13px] text-black opacity-80 transition-opacity hover:opacity-100";

export function SectionsCell() {
  const titledSections = sections.filter((section) => section.heading);

  return (
    <nav aria-label="Sections">
      <ul className="flex flex-row flex-wrap gap-4 md:flex-col">
        {titledSections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} onClick={handleSectionLinkClick} className={ITEM_CLASS}>
              {section.heading}
            </a>
          </li>
        ))}
        <li className="md:hidden">
          <a href="#about" className={ITEM_CLASS}>
            Top
          </a>
        </li>
      </ul>
    </nav>
  );
}
