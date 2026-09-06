// Middle column content: a sequence of sections, each a subheading + paragraphs.
// `kind: "special"` marks a subheading that will later get a notification-style
// color and scroll to its own content area. For now it renders like any other.

export type SectionKind = "normal" | "special";

export interface Section {
  id: string; // anchor target, used by the nav
  heading: string;
  body: string[]; // one string per paragraph
  kind?: SectionKind;
}

// Placeholder copy. Replace with the real paragraphs.
export const sections: Section[] = [
  {
    id: "now",
    heading: "Now",
    body: [
      "I work on software at Paradigm with a portfolio company, and take on brand identity and digital work for founders on the side.",
      "I live in Brooklyn.",
    ],
  },
  {
    id: "before",
    heading: "Before",
    body: [
      "Core Services and UI at Apple. Full-stack at ETALYC. Founded Polyglot, a language learning app, and co-founded Tokn, a social layer over token analytics that was acquired.",
      "Research at Seoul National on sequence classification for historical genomic data, at Carnegie Mellon on neuron classification, and at Santa Cruz on a text-to-video generation pipeline.",
    ],
  },
  {
    id: "design",
    heading: "Design",
    body: [
      "My first paid design was a website for a friend's health club. I spent ten times the hours I quoted and never wanted to stop.",
      "Since then: brand systems, interfaces, and the occasional shader.",
    ],
    kind: "special",
  },
  {
    id: "writing",
    heading: "Writing",
    body: ["Occasional essays at venh.substack.com."],
  },
];
