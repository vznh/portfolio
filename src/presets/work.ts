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
    title: "Making campus accessible again",
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
    title: "Brutalist-inspired calendar planning utility",
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
    title: "TikTok to feedthepudge converter",
    imgPaths: [
      "/images/projects/feedthepudge/1.png"
    ],
    categories: ["web", "consumer", "genai"],
    accent: "bg-white",
  },
  {
    key: 7,
    title: "CLI to contextually debug within your codebase",
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
    url: "https://github.com/yamadashy/repomix",
    title: "Pack your codebase instantly",
    imgPaths: [
      "/images/projects/repomix/1.png"
    ],
    categories: ["devtools", "open-source"],
    accent: "bg-white",
  },
  {
    key: 9,
    title: "Open-source wealth management software",
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
    title: "Creating a new layer of interactibility",
    categories: ["computer vision", "design"],
    url: "https://permanence.vercel.app",
    imgPaths: [
      "/images/projects/permanence/1.png"
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Language learning through assimilation",
    categories: ["edtech", "ai", "venture"],
    imgPaths: [
      "/images/projects/rhetoric/1.png"
    ],
    accent: "bg-black",
  },
  {
    key: 3,
    title: "Modular and purposely designed component library",
    categories: ["react", "npm"],
    imgPaths: [
      "/images/projects/placeholder.png"
    ],
    accent: "bg-black",
  },
  {
    key: 4,
    title: "Autonomous product management for shipping fast",
    categories: ["design", "ai", "venture"],
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
    title: "A Family Guy remake of Peter Griffin cutting up in traffic",
    categories: ["game design", "classwork", "exploration"],
    imgPaths: [
      "/images/projects/familyguy/1.png"
    ],
    accent: "bg-white",
  },
  {
    key: 3,
    title: "Remaking 2hollis unreleased beats with Strudel",
    categories: ["recreational", "i love you 2"],
    imgPaths: [
      "/images/projects/strudel/2hollis.png"
    ],
    accent: "bg-white",
  },
  {
    key: 4,
    title: "Bay Area fashion y2k chronically online test",
    url: "https://grandiose-five.vercel.app",
    categories: ["stupid", "open-source", "consumer"],
    imgPaths: [
      "/images/projects/grandiose/1.png"
    ],
    accent: "bg-white",
  },

]
