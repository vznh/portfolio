// presets/work

import { WorkRowProps } from "@/components/WorkSection";
export const experiences: WorkRowProps[] = [
  {
    key: 2,
    company: "Paradigm",
    role: "Software",
    img: "/images/logo/paradigm.png",
    imgClassName: "grayscale",
    focusDesc: "Working with a portfolio company.",
  },
  {
    key: 0,
    company: "Independent Design",
    role: "Creative",
    img: "/images/logo/hi.png",
    images: ["/videos/paradigm-1.mov", "/videos/paradigm-2.mov", "/images/kim.png", "/images/picky-1.png", "/images/agmnt-content.png", "/images/coinvest.png"],
    focusDate: "2025 - Present",
    focusLocation: "Brooklyn, New York",
    focusDesc: "I currently create brand identities and digital experiences for ambitious founders."
  },
  {
    key: 1,
    company: "Apple",
    role: "Software",
    img: "/images/apple.png",
    focusDate: "2024",
    focusLocation: "Cupertino, California",
    focusDesc: "Core Services & UI"
  },
  {
    key: 3,
    company: "ETALYC",
    role: "Software",
    img: "/images/etalyc.png",
    focusDate: "2023 - 2024",
    focusLocation: "New York City, New York",
    focusDesc: "Full-stack"
  },
  {
    key: 6,
    company: "Stanford",
    role: "Product",
    img: "/images/stanford.png",
    imgClassName: "scale-[0.65]",
    focusDate: "2023 - 2024",
    focusLocation: "Stanford, California",
    focusDesc: "I founded Polyglot, a language learning app. Polyglot participated in Stanford Launchpad.\n\nI co-founded Tokn, a social cryptocurrency analytics platform, owning all technical work. Exited in a multi-six acquisition.",
    images: ["/images/projects/polyglot/polyglot.png"]
  },
  {
    key: 7,
    company: "Seoul National",
    role: "Research",
    img: "/images/snu.png",
    imgClassName: "grayscale scale-[0.80]",
    focusDate: "2023 - 2024",
    focusLocation: "Seoul, South Korea",
    focusDesc: "Sequence classification for historical data"
  },
  {
    key: 4,
    company: "Carnegie Mellon",
    role: "Research",
    img: "/images/cmu.png",
    focusDate: "2022 - 2023",
    focusLocation: "Pittsburgh, Pennsylvania",
    focusDesc: "Neural network for neuron classification and association"
  },
  {
    key: 5,
    company: "Santa Cruz",
    role: "Research",
    img: "/images/ucsc.png",
    focusDate: "2022 - 2023",
    focusLocation: "Santa Cruz, California",
    focusDesc: "Built a text-to-video generation pipeline"
  },
];


export interface ProjectProps {
  key: number;
  videoPath: string;
  leftText?: string;
  rightText?: string;
  url?: string;
  priority?: boolean;
}

export const projects: ProjectProps[] = [
  {
    key: 0,
    videoPath: "/images/projects/experiments/reactive.mp4",
    leftText: "REACTIVE / @vznh/components",
    rightText: "NPM PKG",
    url: "https://npmjs.com/@vznh/components"
  },
  {
    key: 1,
    videoPath: "/images/projects/experiments/led.mp4",
    leftText: "LED / @vznh/components",
    rightText: "NPM PKG",
    url: "https://npmjs.com/@vznh/components",
  },
  {
    key: 2,
    videoPath: "/images/projects/experiments/rechorded.mp4",
    leftText: "INTERACTIVITY / RECHORDED",
    rightText: "NEXT.JS",
  },
  {
    key: 3,
    videoPath: "/images/projects/experiments/pathfinder.mp4",
    leftText: "MAP NAVIGATION / PATHFINDER",
    rightText: "NEXT.JS",
  },
  {
    key: 4,
    videoPath: "/images/projects/experiments/brutal.mp4",
    leftText: "DIAL AND INTERACTION / BRUTAL",
    rightText: "NEXT.JS",
  },
  {
    key: 5,
    videoPath: "/images/projects/experiments/tokn.mp4",
    leftText: "WEB EXPERIENCE / TOKN",
    rightText: "NEXT.JS",
    url: "https://tokn.so",
  },
  {
    key: 6,
    videoPath: "/images/projects/experiments/dreamscape.mp4",
    leftText: "INTERFACE IMPL / DREAMSCAPE",
    rightText: "NEXT.JS",
  },
  {
    key: 7,
    videoPath: "/images/projects/experiments/75-day.mp4",
    leftText: "BOT FUNCTIONALITY / 75",
    rightText: "NODE",
    url: "https://github.com/vznh/75",
  }
]
