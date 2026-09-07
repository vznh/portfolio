import { sections, type Section } from "@/presets/content";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[13px] text-black">{children}</h2>
  );
}

function Prose({ section }: { section: Section }) {
  // `special` sections will get their own color + scroll target later; same look for now.
  return (
    <section id={section.id} className="mb-10 last:mb-0">
      <PanelLabel>{section.heading}</PanelLabel>
      <div className="mt-3 flex flex-col gap-3">
        {section.body.map((paragraph, i) => (
          <p key={i} className="max-w-[52ch] text-[13px] leading-relaxed text-black">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

// Middle column cell: the prose sections.
export function ProseCell() {
  return (
    <div>
      {sections.map((section) => (
        <Prose key={section.id} section={section} />
      ))}
    </div>
  );
}
