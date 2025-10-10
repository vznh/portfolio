// presets/work

import { WorkRowProps } from "@/components/WorkSection";
export const experiences: WorkRowProps[] = [
  { key: 1, company: "Apple", role: "Software", img: "/images/apple-logo.png", date: "2024"},
  { key: 3, company: "ETALYC",  role: "Software", img: "/images/etalyc.png", date: "2023" },
  { key: 4, company: "Carnegie Mellon",  role: "Research", img: "/images/cmu.png", date: "2022" },
  { key: 5, company: "UC Santa Cruz",  role: "Research", img: "/images/ucsc.png", date: "2022" },
];

import { ProjectRowProps } from "@/components/ProjectSection";
export const projects: ProjectRowProps[] = [
  {
    key: 1,
    title: "Tokn",
    desc: "Co-founded Solana token analytics platform with communities that connect in real time. Sold in March 2024.",
    categories: ["WEB", "CRYPTO", "DESIGN", "VENTURE"],
    imgPaths: [
      "/images/projects/tokn/1.png",
      "/images/projects/tokn/2.png",
      "/images/projects/tokn/3.png",
      "/images/projects/tokn/4.png"
    ],
    url: "https://tokn.so",
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Pathfinder",
    desc: "Student tool for precise nav and club interactions",
    categories: ["WEB", "DESIGN", "ACADEMIC"],
    imgPaths: [
      "/images/projects/pathfinder/1.png",
      "/images/projects/pathfinder/4.png"
    ],
    url: "",
    accent: "bg-white",
  },
  {
    key: 5,
    title: "Chronolex",
    desc: "Use natural language to easily create, read, update, or delete your events for Google Calendar.",
    url: "",
    categories: ["WEB", "DESIGN", "HACKATHON"],
    imgPaths: [
      "/images/projects/brutal/1.png",
      "/images/projects/brutal/2.png",
      "/images/projects/brutal/3.png",
      "/images/projects/brutal/4.png",
    ],
    accent: "bg-white",
  },
  {
    key: 6,
    title: "Hungry",
    desc: "TikTok to feedthepudge converter",
    imgPaths: [
      "/images/projects/feedthepudge/1.png"
    ],
    categories: ["WEB", "AI", "PERSONAL"],
    accent: "bg-white",
  },
  {
    key: 7,
    title: "Splat",
    desc: "CLI to contextually debug off of your traceback",
    imgPaths: [
      "/images/projects/splat/1.png",
      "/images/projects/splat/2.png",
      "/images/projects/splat/3.png",
    ],
    url: "https://github.com/ehcaw/splat",
    categories: ["TOOLS", "HACKATHON"],
    accent: "bg-white",
  },
  {
    key: 8,
    title: "Mechanic",
    desc: "Tool to automatically review and analyze code for PRs like a senior engineer.",
    imgPaths: [
      "/images/projects/placeholder.png",
    ],
    categories: ["TOOLS", "AI", "HACKATHON"],
    accent: "bg-black"
  },
  {
    key: 9,
    title: "Dreamscape",
    desc: "Speak your dreams into reality.",
    imgPaths: [
      "/images/projects/dreamscape/1.png",
      "/images/projects/dreamscape/2.png",
      "/images/projects/dreamscape/3.png",
      "/images/projects/dreamscape/4.png",
      "/images/projects/dreamscape/5.png",
    ],
    url: "https://aihack-mu.vercel.app",
    categories: ["DESIGN", "AI", "HACKATHON"],
    accent: "bg-black"
  },
  {
    key: 10,
    title: "Conundrum",
    desc: "Escape room generator that allowed community-driven contributions for infinite possibility of escape rooms.",
    imgPaths: [
      "/images/projects/conundrum/1.png"
    ],
    categories: ["WEB", "HACKATHON"],
    accent: "bg-black"
  },
  {
    key: 11,
    title: "Simply",
    desc: "Tool to optimize reduction of small, medium, or big business expenses through analyzed POS + receipt data.",
    imgPaths: [
      "/images/projects/simply/1.png",
      "/images/projects/simply/2.png",
      "/images/projects/simply/3.png",
    ],
    categories: ["WEB", "AI", "HACKATHON"],
    accent: "bg-black"
  }

]

export const open: ProjectRowProps[] = [
  {
    key: 1,
    url: "https://github.com/yamadashy/repomix",
    title: "Repomix",
    desc: "Pack your codebase instantly into XML, TXT, or MD files",
    imgPaths: [
      "/images/projects/repomix/1.png"
    ],
    categories: ["TOOLS", "OPEN-SOURCE"],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Ghostfolio",
    desc: "Wealth management software",
    url: "https://github.com/ghostfolio/ghostfolio",
    imgPaths: [
      "/images/projects/ghostfolio/2.png",
      "/images/projects/ghostfolio/3.png",
    ],
    categories: ["WEB", "OPEN-SOURCE"],
    accent: "bg-white",
  },
]

export const upcoming: ProjectRowProps[] = [
  {
    key: 1,
    title: "Permanence",
    desc: "Creating a new layer of interactibility.",
    categories: ["WEB", "DESIGN", "COMMERCIAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/permanence/cover.png"
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Rhetoric",
    desc: "Language learning through assimilation. Part of Stanford Launchpad C/O 2024.",
    categories: ["WEB", "AI", "COMMERCIAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/rhetoric/1.png"
    ],
    accent: "bg-black",
  },
  {
    key: 3,
    title: "Devour",
    desc: "Modular and purposely designed React component library.",
    categories: ["LIBRARY", "DESIGN", "COMMERCIAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/devour/devour_cover.png"
    ],
    accent: "bg-black",
  },
  {
    key: 4,
    title: "Pantheon",
    desc: "Cursor for product management",
    categories: ["WEB", "AI", "COMMERCIAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/pantheon/pantheon_cover.png"
    ],
    accent: "bg-black",
  },
  {
    key: 5,
    title: "Newtor",
    desc: "Generated newsletters about emergent topics in tech, from sources such as X.",
    categories: ["WEB", "AI", "COMMERCIAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/placeholder.png"
    ],
    accent: "bg-black",
  },
  {
    key: 6,
    title: "Tangled",
    desc: "Connect with your friends through shared favorite artists, mapping relationships to the Nth degree.",
    categories: ["WEB", "PERSONAL"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/tangled/1.png",
      "/images/projects/tangled/2.png",
      "/images/projects/tangled/3.png",
    ],
    accent: "bg-black"
  },
  {
    key: 7,
    title: "Relic",
    desc: "A graph depiction of all historic events that could be related to each other.",
    categories: ["WEB"],
    url: "https://tally.so/r/wgxdK1",
    imgPaths: [
      "/images/projects/placeholder.png",
    ],
    accent: "bg-black"
  },
];

export const other: ProjectRowProps[] = [
  {
    key: 0,
    title: "Losing money to friends",
    desc: "If I miss submitting proof, the bot Venmos $20 plus lost days, split among 6 friends.",
    categories: [],
    imgPaths: [
      "/images/projects/75/1.png",
      "/images/projects/75/2.png",
      "/images/projects/75/3.png"
    ],
    accent: "bg-white",
  },
  {
    key: 1,
    title: "Trading like Nancy Pelosi",
    categories: ["RESEARCH", "ACADEMIC"],
    imgPaths: [
      "/images/projects/veil/1.png",
      "/images/projects/veil/2.png"
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Peter Griffin cutting up in traffic",
    categories: ["WEB", "ACADEMIC"],
    imgPaths: [
      "/images/projects/familyguy/1.png"
    ],
    accent: "bg-white",
  },
  {
    key: 3,
    title: "Remaking 2hollis beats with Strudel",
    categories: ["TOOLS", "PERSONAL"],
    imgPaths: [
      "/images/projects/strudel/2hollis.png"
    ],
    accent: "bg-white",
  },
  {
    key: 4,
    title: "Fashion y2k chronically online test",
    url: "https://grandiose-five.vercel.app",
    categories: ["WEB", "PERSONAL", "OPEN-SOURCE"],
    imgPaths: [
      "/images/projects/grandiose/1.png"
    ],
    accent: "bg-white",
  },

]
