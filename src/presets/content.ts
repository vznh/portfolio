// Middle column content: a sequence of sections, each an optional subheading
// plus paragraphs. Paragraphs are plain strings with two inline forms:
//   [text](https://url)  -> link
//   [text]               -> "special" accent: a notification-colored hook that
//                           will later scroll to its own content area
// `kind: "special"` on a section marks its subheading the same way. Neither
// changes focus or hijacks scroll.

export type SectionKind = "normal" | "special";

export interface Section {
  id: string; // anchor target
  heading?: string;
  body: string[]; // one string per paragraph
  kind?: SectionKind;
}

export const sections: Section[] = [
  {
    id: "about",
    body: [
      "My name is Jason. I’m an engineer first, designer second. I’m based in New York City. I graduated Santa Cruz at 20, and worked previously in San Francisco, Seoul, Pennsylvania, and Santa Cruz.",
      "The best ways to reach out are through my [e-mail](mailto:jasonvinhson@gmail.com), or through my [Twitter](https://x.com/jasonvinhson). I’m least accessible through my [LinkedIn](https://linkedin.com/in/vznh). I often create for myself and friends, or contribute to open-source like [Repomix](https://github.com/yamadashy/repomix), [biome](https://github.com/biomejs/biome), [Zed](https://github.com/zed-industries/zed/fork), and [bb](https://github.com/get-bb/bb).",
      "I do engineering, research, and design in New York. I used to do systems and interfacing at Apple. I started two start-ups and sold one. Then machine learning at Carnegie Mellon, Seoul National, Santa Cruz. Leading up to and in university, full-stack engineering for an urban engineering start-up as one of two interns.",
      "I can tell a further tale about my [provenance].",
    ],
  },
];
