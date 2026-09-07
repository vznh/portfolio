import { sections } from "@/presets/content";
import { useExpandedSections } from "@/hooks/useExpandedSections";

// Scroll the middle column so the section's subheading sits at the vertical
// midpoint of the viewport. scrollIntoView targets the nearest scrollable
// ancestor: the middle column on desktop, the document on mobile.
function scrollToHeading(id: string) {
  const heading = document.getElementById(id)?.querySelector("h2");
  heading?.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Right column cell below the clocks: the subheadings of every section the
// user has opened, in the order they opened them. Each line fades in on
// arrival and leaves when its section is closed. Clicking one scrolls to it.
export function OpenedSectionsCell() {
  const { expanded } = useExpandedSections();
  const opened = expanded
    .map((id) => sections.find((section) => section.id === id))
    .filter((section) => section?.heading);

  return (
    <ul className="flex flex-col gap-2">
      {opened.map((section) => (
        <li key={section!.id} className="animate-fade-in">
          <button
            type="button"
            onClick={() => scrollToHeading(section!.id)}
            className="cursor-pointer font-heading text-[13px] text-black opacity-80 transition-opacity hover:opacity-100"
          >
            {section!.heading}
          </button>
        </li>
      ))}
    </ul>
  );
}
