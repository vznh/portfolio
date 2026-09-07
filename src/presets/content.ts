// Middle column content: a sequence of sections, each an optional subheading
// plus paragraphs. Paragraphs are plain strings with two inline forms that
// look identical on the page:
//   [text](https://url)  -> normal link
//   [text](+section-id)  -> expander: reveals the collapsed section with that
//                           id, in place, without moving focus or scrolling
// A section with `collapsed: true` stays hidden until an expander opens it.

export interface Section {
  id: string; // anchor target; expanders reference it with (+id)
  heading?: string;
  body: string[]; // one string per paragraph
  collapsed?: boolean;
}

export const sections: Section[] = [
  {
    id: "about",
    body: [
      "My name is Jason. I’m an engineer first, designer second. I’m based in New York City. I graduated Santa Cruz at 20, and worked previously in San Francisco, Seoul, Pennsylvania, and Santa Cruz.",
      "I’m trying a lot of new restaurants - at 370 this year as of writing. I join runs for basketball near Lower East Side often. I play tennis and pickleball socially. My closet is compiled from Acne Studios, Enfants Riches Déprimés, COS, Our Legacy, No Maintenance, Blackmerle, Chrome Hearts, and more. I model commercially occasionally. I enjoy playing with fabrics through repair or experiment. I also like conceptually designing for my favorite artists and things. I watch a lot of [anime](https://anilist.co/user/vznh) and read a lot of manga and manhwa. I [write on an irregular cadence](https://venh.substack.com), and inversely am introductory to reading books. I host events with my friends, from home cafes to DJ sets.",
      "The best ways to reach out are through my [e-mail](mailto:jasonvinhson@gmail.com), or through my [Twitter](https://x.com/jasonvinhson). I’m least accessible through my [LinkedIn](https://linkedin.com/in/vznh). I often create for myself and friends, or contribute to open-source on [GitHub](https://github.com/vznh) like [Repomix](https://github.com/yamadashy/repomix), [biome](https://github.com/biomejs/biome), [Zed](https://github.com/zed-industries/zed/fork), and [bb](https://github.com/get-bb/bb).",
      "I do engineering, research, and design in New York. I used to do systems and interfacing at Apple. I started two start-ups and sold one. Then machine learning at Carnegie Mellon, Seoul National, Santa Cruz. Leading up to and in university, full-stack engineering for an urban engineering start-up as one of two interns.",
      "I can tell a further tale about my [provenance](+provenance).",
    ],
  },
  {
    id: "provenance",
    heading: "Provenance",
    collapsed: true,
    // Seeded with the opening line from the previous site. Replace and extend.
    body: ["Over the course of 9 years, I started 102 projects, finished 52, and launched 24 of them."],
  },
];
