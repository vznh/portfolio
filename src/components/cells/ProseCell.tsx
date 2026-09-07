import { sections, type Section } from "@/presets/content";

// Special hooks are underlined only for now; a notification color comes later.
const SPECIAL_CLASS = "underline decoration-gray-300 underline-offset-2";

function PanelLabel({ children, special }: { children: React.ReactNode; special?: boolean }) {
  return (
    <h2 className={`font-heading text-[13px] ${special ? SPECIAL_CLASS : "text-black"}`}>{children}</h2>
  );
}

// Inline syntax: [text](url) -> link, [text] -> special accent. See presets/content.ts.
const INLINE = /\[([^\]]+)\](?:\(([^)]+)\))?/g;

function renderInline(paragraph: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of paragraph.matchAll(INLINE)) {
    const [raw, text, url] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(paragraph.slice(last, start));
    if (url) {
      const external = !url.startsWith("mailto:");
      nodes.push(
        <a
          key={start}
          href={url}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-black"
        >
          {text}
        </a>,
      );
    } else {
      // Special hook: colored only, no scroll behavior yet.
      nodes.push(
        <span key={start} className={SPECIAL_CLASS}>
          {text}
        </span>,
      );
    }
    last = start + raw.length;
  }
  if (last < paragraph.length) nodes.push(paragraph.slice(last));
  return nodes;
}

function Prose({ section }: { section: Section }) {
  return (
    <section id={section.id} className="mb-10 last:mb-0">
      {section.heading && <PanelLabel special={section.kind === "special"}>{section.heading}</PanelLabel>}
      <div className={`flex flex-col gap-3 ${section.heading ? "mt-3" : ""}`}>
        {section.body.map((paragraph, i) => (
          <p key={i} className="max-w-[52ch] text-[0.85rem] leading-relaxed tracking-[-0.025em] text-black">
            {renderInline(paragraph)}
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
