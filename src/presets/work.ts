// presets/work

import { WorkRowProps } from "@/components/WorkSection";
export const experiences: WorkRowProps[] = [
  {
    key: 0,
    company: "Independent Design",
    role: "Software",
    img: "/images/logo/hi.png",
    date: "JUN 2025 - PRESENT",
    images: ["/images/projects/morecompute/logo.png", "/images/projects/morecompute/sidebar.png"],
    focusDate: "JUN 2025 - PRESENT",
    focusRole: "DENG",
    focusDesc: "I currently create brand identities and digital experiences for ambitious founders."
  },
  {
    key: 1,
    company: "Apple",
    role: "Software",
    img: "/images/apple.png",
    date: "JUN 2024 - AUG 2024",
    focusDate: "JUN 2024 - AUG 2024",
    focusRole: "SWE",
    focusDesc: "I worked on the CoreOS team, focusing on various parts of the operating system and user interface when changes were made in the Settings app for the release of iOS26."
  },
  {
    key: 3,
    company: "ETALYC",
    role: "Software",
    img: "/images/etalyc.png",
    date: "2023",
    focusDate: "SEP 2023 - FEB 2024",
    focusRole: "SWE",
    focusDesc: "I worked on Hypersafe, a platform for traffic engineers to analyze incident data. I worked on everything from front, back and data. I cut hefty production processing from 2 minutes to averaging sub-10  seconds, and impl. memoization to handle 10K+ HTTP requests with a 99.6% cost drop."
  },
  {
    key: 4,
    company: "Carnegie Mellon",
    role: "Research",
    img: "/images/cmu.png",
    date: "2022",
    focusDate: "SEP 2022 - MAY 2023",
    focusRole: "Scholar",
    focusDesc: "I built a baseline scalable neural network using Rust to interpret variably scabled neurological data for the Neuro Technology and Engineering lab."
  },
  {
    key: 5,
    company: "UC Santa Cruz",
    role: "Research",
    img: "/images/ucsc.png",
    date: "2022",
    focusDate: "DEC 2022 - JUN 2023",
    focusRole: "Scholar",
    focusDesc: "I helped build a prompt-to-video pipeline, experimenting with the film industry to produce Version 0 prototypes under Dr. Allen."
  },
];


export interface ProjectProps {
  key: number;
  title: string;
  videoPath: string;
  accent: string;
  leftText?: string;
  rightText?: string;
  url?: string;
  priority?: boolean;
}

export const projects: ProjectProps[] = [
  {
    key: 0,
    title: "REACTIVE",
    videoPath: "/images/projects/experiments/REACTIVE.gif",
    accent: "bg-white",
    leftText: "REACTIVE / @vznh/components",
    rightText: "NPM PKG",
    url: "https://npmjs.com/@vznh/components"
  },
  {
    key: 1,
    title: "LED",
    videoPath: "/images/projects/experiments/LED.mp4",
    accent: "bg-white",
    leftText: "LED / @vznh/components",
    rightText: "NPM PKG",
    url: "https://npmjs.com/@vznh/components",
  },
  {
    key: 2,
    title: "RECHORDED",
    videoPath: "/images/projects/experiments/RECHORDED.mp4",
    accent: "bg-white",
    leftText: "INTERACTIVITY / RECHORDED",
    rightText: "NEXT.JS",
  },
  {
    key: 3,
    title: "PATHFINDER",
    videoPath: "/images/projects/experiments/PATHFINDER.mp4",
    accent: "bg-white",
    leftText: "MAP NAVIGATION / PATHFINDER",
    rightText: "NEXT.JS",
  },
  {
    key: 4,
    title: "BRUTAL",
    videoPath: "/images/projects/experiments/BRUTAL.mp4",
    accent: "bg-white",
    leftText: "DIAL AND INTERACTION / BRUTAL",
    rightText: "NEXT.JS",
  },
  {
    key: 5,
    title: "TOKN",
    videoPath: "/images/projects/experiments/TOKN.mp4",
    accent: "bg-white",
    leftText: "WEB EXPERIENCE / TOKN",
    rightText: "NEXT.JS",
    url: "https://tokn.so",
  },
  {
    key: 6,
    title: "DREAMSCAPE",
    videoPath: "/images/projects/experiments/DREAMSCAPE.mp4",
    accent: "bg-white",
    leftText: "INTERFACE IMPL / DREAMSCAPE",
    rightText: "NEXT.JS",
  },
  {
    key: 7,
    title: "75",
    videoPath: "/images/projects/experiments/75.mp4",
    accent: "bg-white",
    leftText: "BOT FUNCTIONALITY / 75",
    rightText: "NODE",
    url: "https://github.com/vznh/75",
  }
]
