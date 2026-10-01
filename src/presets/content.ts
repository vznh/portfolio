import publications from "./publications.json";

export interface Project {
  name: string;
  description?: string;
  url?: string;
  pullRequests?: string;
}

export type Block = string | { list: string[] };

export interface Entry {
  year: string;
  blocks: Block[];
}

export interface RecordImage {
  src: string;
  width: number;
  height: number;
}

export interface Record {
  date: string;
  title: string;
  name?: string;
  category: string;
  url?: string;
  image?: RecordImage;
}

export interface Section {
  id: string;
  heading?: string;
  body: string[];
  projects?: Project[];
  entries?: Entry[];
  records?: Record[];
}

export const sections: Section[] = [
  {
    id: "about",
    body: [
      "My name is Jason. I’m an engineer first, designer second. I’m based in New York City. I graduated Santa Cruz at 20, and worked previously in San Francisco, Seoul, Pennsylvania, and Santa Cruz.",
      "Access my [works](+records).",
      "I do engineering, research, [technical and fashion design](https://5f.hobin.dev) work in New York. I contribute to [open-source software](https://github.com/vznh) I often use. I used to do systems and interfacing at Apple. I started two [start-ups](+antecedents) and sold one. Then machine learning at Carnegie Mellon, Seoul National, Santa Cruz. Leading up to and in university, full-stack engineering for an urban engineering start-up as one of two interns.",
      "I can tell a further tale about my [provenance](+provenance).",
      "I’m #39,098 on Beli right now. I join runs for basketball near Lower East Side often. I play tennis and pickleball socially. My closet is compiled from Acne Studios, Enfants Riches Déprimés, COS, Our Legacy, No Maintenance, Blackmerle, Chrome Hearts, and more. I model commercial rarely. I enjoy playing with fabrics through repair or experiment. I also like conceptually designing for my favorite artists and things. I watch a lot of [anime](https://anilist.co/user/vznh) and read a lot of manga and manhwa. I [write when I feel like it](https://venh.substack.com), and I read when I can. I'm pretty new to both though. I host events with my friends, from home cafes to DJ sets. I play games recreationally, but used to be #479 on VALORANT for a brief amount of time, and Exalted on Wizard101 as a fire, death player. I used to do a mix of thirst traps and computer science. I garnered 223K followers and 7.2M likes.",
      "The best ways to reach out are through my [e-mail](mailto:jasonvinhson@gmail.com), or through my [Twitter](https://x.com/jasonvinhson). I’m least accessible through my [LinkedIn](https://linkedin.com/in/vznh). I often create for myself and friends, or contribute to open-source on [GitHub](https://github.com/vznh).",
    ],
  },
  {
    id: "records",
    heading: "Records",
    body: [],
    records: [
      {
        date: "10 2026",
        title: "Terminal 27",
        category: "Commission",
        url: "https://instagram.com/terminal27",
        image: { src: "/assets/records/terminal-27.jpg", width: 1244, height: 562 },
      },
      { date: "09 2026", title: "Nine Vicious", category: "Commission" },
      {
        date: "09 2026",
        title: "Little Saigon Beauty Salon",
        category: "Commission",
        url: "https://dukes-ruby.vercel.app",
        image: { src: "/assets/records/little-saigon-beauty-salon.jpg", width: 1600, height: 1015 },
      },
      { date: "09 2026", title: "Find restaurants you really like", name: "Famish", category: "Personal" },
      {
        date: "08 2026",
        title: "Generate captions live on-machine",
        name: "Capt",
        category: "Personal",
        url: "https://github.com/vznh/capt",
      },
      {
        date: "08 2026",
        title: "A richer converter for unreleased music",
        name: "Transmute",
        category: "Personal",
        url: "https://github.com/vznh/transmute",
        image: { src: "/assets/records/transmute.jpg", width: 1432, height: 954 },
      },
      { date: "08 2026", title: "Blends but each song mixes well", name: "Charms", category: "Personal" },
      {
        date: "08 2026",
        title: "Corgi",
        category: "Commission",
        image: { src: "/assets/records/corgi.jpg", width: 800, height: 800 },
      },
      {
        date: "08 2026",
        title: "Britnie",
        category: "Commission",
        image: { src: "/assets/records/britnie.jpg", width: 1200, height: 1200 },
      },
      {
        date: "08 2026",
        title: "Monarch Capital",
        category: "Commission",
        url: "https://monarch-cap.vercel.app",
        image: { src: "/assets/records/monarch-capital.jpg", width: 1600, height: 955 },
      },
      {
        date: "07 2026",
        title: "Karaoke for any song",
        name: "노래 (Norae)",
        category: "Personal",
      },
      {
        date: "07 2026",
        title: "Utility tool on-machine for agents",
        name: "Portmanteau",
        category: "Personal",
      },
      {
        date: "07 2026",
        title: "A business card",
        category: "Commission",
        image: { src: "/assets/records/a-business-card.jpg", width: 1128, height: 646 },
      },
      { date: "07 2026", title: "Stake", category: "Commission" },
      { date: "05 2026", title: "Komune", category: "Advisory", url: "https://komune.space" },
      { date: "04 2026", title: "Paradigm", category: "Commission" },
      { date: "01 2026", title: "Augment", category: "Advisory", url: "https://agmnt.space" },
      {
        date: "10 2025",
        title: "Cut agent token usage",
        name: "Axiom",
        category: "Personal",
      },
      {
        date: "09 2025",
        title: "SDK for Substack",
        name: "Substack, SDK",
        category: "Personal",
        url: "https://github.com/vznh/substack",
      },
      { date: "09 2025", title: "Discord bot for hard 75 submissions", name: "75", category: "Personal" },
      {
        date: "08 2025",
        title: "In-depth Spotify relationships",
        name: "Chordal",
        category: "Personal",
        image: { src: "/assets/records/chordal.jpg", width: 1314, height: 894 },
      },
      {
        date: "0N 2025",
        title: "Co-working experiments",
        name: "081x",
        category: "Personal",
        image: { src: "/assets/records/081x.jpg", width: 800, height: 800 },
      },
      {
        date: "04 2025",
        title: "Chronolex",
        category: "Personal",
        image: { src: "/assets/records/chronolex.jpg", width: 2186, height: 1440 },
      },
      {
        date: "02 2025",
        title: "React interaction components",
        name: "Devour",
        category: "Personal",
      },
      {
        date: "01 2025",
        title: "Better map for Santa Cruz",
        name: "Pathfinder",
        category: "Academia",
        image: { src: "/assets/records/pathfinder.jpg", width: 2444, height: 1334 },
      },
      {
        date: "01 2025",
        title: "Test to see if you're performative",
        name: "Grandiose",
        category: "Personal",
        image: { src: "/assets/records/grandiose.jpg", width: 1648, height: 818 },
      },
      { date: "01 2025", title: "Self-healing quant", name: "Veil", category: "Academia" },
      { date: "01 2025", title: "In-depth bug assessment for Python", name: "Splat", category: "Personal" },
      {
        date: "07 2024",
        title: "Transcribe and preserve old documents",
        name: "Relic",
        category: "Personal",
        image: { src: "/assets/records/relic.jpg", width: 1148, height: 734 },
      },
      { date: "02 2021", title: "Jukebox that plays songs from RFiD", name: "Jukebox", category: "Personal" },
    ],
  },
  {
    id: "antecedents",
    heading: "Antecedents",
    body: [],
    projects: [
      {
        name: "5f",
        url: "https://5f.hobin.dev",
        description:
          "A technical design studio. We design brand identities, create user experiences, and generate company-defining assets.",
      },
      {
        name: "5th Floor",
        description: "Avant-garde brand. Our first sample releases November 2026 for Winter.",
      },
      {
        name: "Agamemnon",
        description: "High-level software workbench.",
      },
      {
        name: "Polyglot",
        description:
          "Learn languages through bite-sized modules that mimic assimilation. We teach reading, writing, typing, and verbal conversation.",
      },
      {
        name: "Tokn",
        description: "Trade, track, and chat coins in one app.",
      },
      {
        name: "Preme",
        description:
          "Be the fastest to buy Supreme. Sold on OGUsers, cracked.io with 200+ purchases at $24.99 each.",
      },
    ],
  },
  {
    id: "engagements",
    heading: "Engagements",
    body: [],
    projects: [
      {
        name: "[Repomix](https://github.com/yamadashy/repomix)",
        description: "Codebases packaged for AI.",
      },
      {
        name: "[Ghostfolio](https://ghostfol.io/en)",
        description: "Investment portfolio tracking.",
      },
      {
        name: "[biome](https://github.com/biomejs/biome)",
        description: "Code formatting and linting.",
        pullRequests:
          "[#11143](https://github.com/biomejs/biome/pull/11143) [#11846](https://github.com/biomejs/biome/pull/11846)",
      },
      {
        name: "[Zed Editor](https://github.com/zed-industries/zed)",
        description: "Collaborative code editor.",
        pullRequests: "[#63224](https://github.com/zed-industries/zed/pull/63224)",
      },
      {
        name: "[bb Editor](https://github.com/get-bb/bb)",
        description: "IDE for coding agents.",
        pullRequests:
          "[#3108](https://github.com/get-bb/bb/pull/3108) [#3813](https://github.com/get-bb/bb/pull/3813) [#3922](https://github.com/get-bb/bb/pull/3922) [#3924](https://github.com/get-bb/bb/pull/3924) [#4092](https://github.com/get-bb/bb/pull/4092) [#4085](https://github.com/get-bb/bb/pull/4085) [#4288](https://github.com/get-bb/bb/pull/4288) [#4299](https://github.com/get-bb/bb/pull/4299)",
      },
      {
        name: "[LiveKit](https://github.com/livekit/agents)",
        description: "Framework for voice AI agents.",
        pullRequests:
          "[#7385](https://github.com/livekit/agents/pull/7385) [#2568](https://github.com/livekit/agents-js/pull/2568)",
      },
    ],
  },
  {
    id: "provenance",
    heading: "Provenance",

    body: ["Over the course of 9 years, I started 102 projects, finished 52, and launched 24 of them."],
    entries: [
      {
        year: "2017",
        blocks: [
          "I bought fake Supreme in middle school. Got made fun of and fed up. I taught myself Python, then automated it. Ended up selling it on OGUsers for a set price, and transacted around 300. This all funneled back into reselling, and I dealt Off-White, Supreme, Anti-Social-Social-Club, and the like.",
        ],
      },
      {
        year: "2019",
        blocks: [
          "I played a lot of Phantom Forces, Apocalypse Rising, and Jail Break on ROBLOX. I was not a fair player. I ended up using Magitan, which had a significant problem: spawning items or performing actions were singular. I had reverse-engineered Magitan with Ghidra, and made small changes to cheat better. This was not publicly released.",
        ],
      },
      {
        year: "2020",
        blocks: [
          "I was planning on being a nurse, similarly to my successful sisters. I pride myself on humanitarianism, and found gratification in taking care of people. I ended up re-visiting coding for two people:",
          "For my first love, I had bought a mahogany box, a Raspberry Pi 3B+, 50 RFiD cards, and a scanner. My first physical project was a jukebox, where 50 of those cards contained her favorite songs at the time. Scanning it would play it on her Sennheiser speaker that was connected to the box.",
          "For my mom, where one of those extra RFiD cards were glued under a thin part of her nightstand, and when tapped, hits a route that sends a message containing the following:",
          {
            list: [
              "3 of the most popular articles in California",
              "2 of the most popular articles in the U.S.",
              "2 political topics being debated about in the U.S.",
            ],
          },
          "… all translated in Vietnamese.",
        ],
      },
      {
        year: "2021",
        blocks: [
          "I started my addiction for hackathons. I also automated a tool to find permutations of short usernames on Riot Games, Instagram, Twitter, and Ubisoft.",
        ],
      },
      {
        year: "2022",
        blocks: [
          "I had started a branch of [Hack Club](https://hackclub.com/), and was sponsored by my city to teach a volunteering cohort of students practical programming. This included creating:",
          { list: ["Your own Discord bot", "A messaging service", "A self portfolio"] },
          "I started my first internship coming out of high school. I had a lot to learn from here, and I’m grateful for my time and mentors.",
          "My roommate was my best friend. We shared a trauma bond after our [first roommate](https://abcnews.com/US/21-year-charged-murder-bay-area-woman-walking/story?id=123996136) had threatened to shoot us. For him and mutual friends we shared, I made:",
          {
            list: [
              "An LED light to indicate if someone’s home",
              "A physical door opener using a servo + locked pliers because we lost our keycard a lot",
            ],
          },
        ],
      },
      {
        year: "2023",
        blocks: [
          "I was unsure about if I wanted to go into the field, or pursue academia. I joined a lab at my university that experimented with text-to-video prompting under [Dr. Allen](https://film.ucsc.edu/directory/eshanken/). Our product generated variable output at 15s/30fps/720p maximum.",
          "I also dove into crypto. I co-founded Tokn, where you can trade, track, and chat with others in one app. I took a minority split in the acquisition.",
          "After, I joined Stanford Launchpad momentarily to start Polyglot, a language learning app. We pitched to:",
          { list: ["Y Combinator", "PearVC", "Antler", "Techstars", "Bronco", "South Park"] },
          "I failed, and hurt people. I learned a lot in this process and continue to reflect on it as I experience new things.",
          "I pursued biotechnology for a bit, leading automation for CMU Neuro Tech, and SNU Genomics. I additionally experimented in low-level systems, game design, theoretical math, and quant. I had realized academia is too slow for me, and I enjoy to get dirty rather theoretical.",
        ],
      },
      {
        year: "2024",
        blocks: [
          "I have an underclassman that really wanted to get to his dream university. In order to do so, his club must be more legitimate than it already is. I designed his website and allocated strict management:",
          {
            list: [
              "I will work on it whenever I am absolutely free",
              "This is not a priority by any means",
              "Please do not expect anything spectacular",
            ],
          },
          "And ended up falling in love with the rabbit hole of design. I could say much about how much I fucked up while making it, but it boils down to the relationship between taste and ability being vastly parted.",
        ],
      },
    ],
  },
  {
    id: "publications",
    heading: "Publications",
    body: [],
    projects: publications,
  },
];
