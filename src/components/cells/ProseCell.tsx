import { sections, type Block, type Section } from "@/presets/content";
import { Records } from "./Records";
import { handleSectionLinkClick } from "@/lib/scrollToHeading";

const LINK_CLASS =
  "underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-black";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-[13px] text-black opacity-80">{children}</h2>;
}

const INLINE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(paragraph: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of paragraph.matchAll(INLINE)) {
    const [raw, text, target] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(paragraph.slice(last, start));
    if (target.startsWith("+")) {
      const id = target.slice(1);
      nodes.push(
        <a key={start} href={`#${id}`} onClick={handleSectionLinkClick} className={LINK_CLASS}>
          {text}
        </a>,
      );
    } else {
      const external = !target.startsWith("mailto:");
      nodes.push(
        <a
          key={start}
          href={target}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={LINK_CLASS}
        >
          {text}
        </a>,
      );
    }
    last = start + raw.length;
  }
  if (last < paragraph.length) nodes.push(paragraph.slice(last));
  return nodes;
}

const BODY_CLASS = "max-w-[52ch] text-[13px] leading-relaxed tracking-[-0.0125em] text-black";

function renderBlock(block: Block) {
  if (typeof block === "string") {
    return (
      <p key={block} className={BODY_CLASS}>
        {renderInline(block)}
      </p>
    );
  }
  return (
    <ul key={block.list.join()} className={`${BODY_CLASS} flex flex-col`}>
      {block.list.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden>–</span>
          <span>{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

function Prose({ section }: { section: Section }) {
  return (
    <section id={section.id} className="mb-[3.75rem] last:mb-0">
      {section.heading && <PanelLabel>{section.heading}</PanelLabel>}
      <div className={`flex flex-col gap-3 ${section.heading ? "mt-3" : ""}`}>
        {section.body.map((paragraph) => (
          <p key={paragraph} className={BODY_CLASS}>
            {renderInline(paragraph)}
          </p>
        ))}
        {section.entries && (
          <div className="flex flex-col gap-6">
            {section.entries.map((entry) => (
              <div key={entry.year} className="flex flex-col gap-1.5">
                <p className={`${BODY_CLASS} opacity-80`}>{entry.year}</p>
                {entry.blocks.map((block) => renderBlock(block))}
              </div>
            ))}
          </div>
        )}
        {section.records && <Records records={section.records} />}
        {section.projects?.map((project) => (
          <p key={project.name} className={BODY_CLASS}>
            <span className="block">{project.name}</span>
            <span className="block opacity-80">{project.description}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

export function ProseCell() {
  return (
    <div>
      {sections.map((section) => (
        <Prose key={section.id} section={section} />
      ))}
    </div>
  );
}
