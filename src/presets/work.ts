// presets/work

import { WorkRowProps } from "@/components/WorkSection";
export const experiences: WorkRowProps[] = [
  { key: 1, company: "Apple", role: "System", img: "/images/apple.png", date: "2024"},
  { key: 2, company: "Stanford Launchpad",  role: "Edtech", img: "/images/stanford.png", date: "2024" },
  { key: 3, company: "ETALYC",  role: "Fullstack", img: "/images/etalyc.png", date: "2023" },
  { key: 4, company: "Carnegie Mellon",  role: "Research", img: "/images/cmu.jpg", date: "2022" },
  { key: 5, company: "UC Santa Cruz",  role: "Research", img: "/images/ucsc.png", date: "2022" },
];

import { ProjectRowProps } from "@/components/ProjectSection";
export const projects: ProjectRowProps[] = [
  {
    key: 2,
    title: "Making campus accessible again",
    categories: ["web", "utility", "education"],
    imgPaths: [
      "/images/projects/pathfinder/1.png",
      "/images/projects/pathfinder/2.png"
    ],
    url: "https://pathfinder-weld.vercel.app",
    accent: "bg-white",
  },
  {
    key: 5,
    title: "Making calendar planning simple",
    url: "https://v0-brutal.vercel.app",
    categories: ["web", "design", "consumer"],
    imgPaths: [
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
    ],
    categories: ["devtools", "hackathon"],
    accent: "bg-white",
  },
  {
    key: 8,
    title: "Pack your codebase instantly",
    imgPaths: [
    ],
    categories: ["devtools", "open-source"],
    accent: "bg-white",
  },
  {
    key: 9,
    title: "Open-source wealth management software",
    imgPaths: [
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
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Modular and purposely designed component library",
    categories: ["react", "npm"],
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 3,
    title: "Language learning through assimilation",
    categories: ["edtech", "ai", "venture"],
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 4,
    title: "Autonomous product management for shipping fast",
    categories: ["design", "ai", "venture"],
    imgPaths: [
    ],
    accent: "bg-white",
  },
]

export const other: ProjectRowProps[] = [
  {
    key: 1,
    title: "Predicting returns on short-term market data",
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 2,
    title: "Peter Griffin beating traffic",
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 3,
    title: "Remaking 2hollis beats with Strudel",
    imgPaths: [
    ],
    accent: "bg-white",
  },
  {
    key: 4,
    title: "Bay Area fashion insufferability test",
    imgPaths: [
    ],
    accent: "bg-white",
  },

]
