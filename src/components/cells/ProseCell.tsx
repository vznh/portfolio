import { sections, type Block, type Section } from "@/presets/content";
import { Records } from "./Records";
import { useExpandedSections } from "@/hooks/useExpandedSections";

const LINK_CLASS =
  "underline decoration-gray-300 underline-offset-2 transition-colors hover:decoration-black";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-heading text-[13px] text-black opacity-80">{children}</h2>;
}

const INLINE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(paragraph: string, isExpanded: (id: string) => boolean, toggle: (id: string) => void) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of paragraph.matchAll(INLINE)) {
    const [raw, text, target] = match;
    const start = match.index ?? 0;
    if (start > last) nodes.push(paragraph.slice(last, start));
    if (target.startsWith("+")) {
      const id = target.slice(1);
      nodes.push(
        <button
          key={start}
          type="button"
          aria-expanded={isExpanded(id)}
          aria-controls={id}
          onClick={() => toggle(id)}
          className={`${LINK_CLASS} cursor-pointer`}
        >
          {text}
        </button>,
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

function renderBlock(block: Block, isExpanded: (id: string) => boolean, toggle: (id: string) => void) {
  if (typeof block === "string") {
    return (
      <p key={block} className={BODY_CLASS}>
        {renderInline(block, isExpanded, toggle)}
      </p>
    );
  }
  return (
    <ul key={block.list.join()} className={`${BODY_CLASS} flex flex-col`}>
      {block.list.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden>–</span>
          <span>{renderInline(item, isExpanded, toggle)}</span>
        </li>
      ))}
    </ul>
  );
}

function Prose({ section }: { section: Section }) {
  const { isExpanded, toggle } = useExpandedSections();

  const hidden = Boolean(section.collapsed) && !isExpanded(section.id);
  return (
    <section id={section.id} className="mb-[3.75rem] last:mb-0" hidden={hidden}>
      {section.heading && <PanelLabel>{section.heading}</PanelLabel>}
      <div className={`flex flex-col gap-3 ${section.heading ? "mt-3" : ""}`}>
        {section.body.map((paragraph) => (
          <p key={paragraph} className={BODY_CLASS}>
            {renderInline(paragraph, isExpanded, toggle)}
          </p>
        ))}
        {section.entries && (
          <div className="flex flex-col gap-6">
            {section.entries.map((entry) => (
              <div key={entry.year} className="flex flex-col gap-1.5">
                <p className={`${BODY_CLASS} opacity-80`}>{entry.year}</p>
                {entry.blocks.map((block) => renderBlock(block, isExpanded, toggle))}
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
