// presets/work

import { WorkRowProps } from "@/components/WorkSection";
export const experiences: WorkRowProps[] = [
  { key: 1, company: "Apple", role: "System", img: "/images/apple.png", date: "2024"},
  { key: 2, company: "Stanford Launchpad",  role: "Edtech", img: "/images/stanford.png", date: "2024" },
  { key: 3, company: "ETALYC",  role: "Fullstack", img: "/images/etalyc.png", date: "2023" },
  { key: 4, company: "Carnegie Mellon",  role: "Research", img: "/images/cmu.png", date: "2022" },
  { key: 5, company: "UC Santa Cruz",  role: "Research", img: "/images/ucsc.png", date: "2022" },
];

import { ProjectRowProps } from "@/components/ProjectSection";
export const projects: ProjectRowProps[] = [
  {
    key: 2,
    title: "Pathfinder",
    desc: "Student tool for precise nav and club interactions",
    categories: ["web", "utility", "education", "design"],
    imgPaths: [
      "/images/projects/pathfinder/1.png",
      "/images/projects/pathfinder/2.png",
      "/images/projects/pathfinder/3.png",
      "/images/projects/pathfinder/4.png"
    ],
    url: "",
    accent: "bg-white",
  },
  {
    key: 5,
    title: "Brutal",
    desc: "Brutalist-inspired calendar planning utility",
    url: "",
    categories: ["web", "design", "consumer"],
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
    categories: ["web", "consumer", "genai"],
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
    categories: ["devtools", "hackathon"],
    accent: "bg-white",
  },
  {
    key: 8, 
    title: "Mechanic",
    desc: "Tool to automatically review and analyze code for PRs like a senior engineer. We didn't know what Greptile was at the time.",
    imgPaths: [
      "/images/projects/placeholder.png",
    ],
    categories: ["devtools", "hackathon"],
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
    categories: ["design", "hackathon"],
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
    categories: ["devtools", "open-source"],
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
    categories: ["quant", "web", "open-source"], // + web
    accent: "bg-white",
  },
]

export const upcoming: ProjectRowProps[] = [
  {
    key: 1,
    title: "Permanence",
    desc: "Creating a new layer of interactibility",
    categories: ["cv", "design", "web"],
    url: "https://permanence.vercel.app",
    imgPaths: [
      "/images/projects/permanence/cover.png"
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Polyglot",
    desc: "Language learning through assimilation",
    categories: ["edtech", "ai", "venture"],
    imgPaths: [
      "/images/projects/rhetoric/1.png"
    ],
    accent: "bg-black",
  },
  {
    key: 3,
    title: "Devour",
    desc: "Modular and purposely designed React component library",
    categories: ["npm", "library"],
    imgPaths: [
      "/images/projects/devour/devour_cover.png"
    ],
    accent: "bg-black",
  },
  {
    key: 4,
    title: "Pantheon",
    desc: "Cursor for product management",
    categories: ["design", "ai", "venture"],
    imgPaths: [
      "/images/projects/pantheon/pantheon_cover.png"
    ],
    accent: "bg-black",
  },
  {
    key: 5,
    title: "Newtor",
    desc: "Generated newsletters about emergent topics in tech, from sources such as X.",
    categories: ["commission"],
    imgPaths: [
      "/images/projects/placeholder.png"
    ],
    accent: "bg-black",
  }, 
]

export const other: ProjectRowProps[] = [
  {
    key: 1,
    title: "Predicting returns on short-term market data",
    categories: ["quant", "classwork", "ptf"],
    imgPaths: [
      "/images/projects/veil/1.png",
      "/images/projects/veil/2.png"
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Peter Griffin cutting up in traffic",
    categories: ["game design", "classwork", "exploration"],
    imgPaths: [
      "/images/projects/familyguy/1.png"
    ],
    accent: "bg-white",
  },
  {
    key: 3,
    title: "Remaking 2hollis beats with Strudel",
    categories: ["recreational", "ily2hollis"],
    imgPaths: [
      "/images/projects/strudel/2hollis.png"
    ],
    accent: "bg-white",
  },
  {
    key: 4,
    title: "Fashion y2k chronically online test",
    url: "https://grandiose-five.vercel.app",
    categories: ["stupid", "open-source", "consumer"],
    imgPaths: [
      "/images/projects/grandiose/1.png"
    ],
    accent: "bg-white",
  },

]
