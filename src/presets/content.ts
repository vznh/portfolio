export interface Project {
  name: string;
  description: string;
}

export type Block = string | { list: string[] };

export interface Entry {
  year: string;
  blocks: Block[];
}

export interface Record {
  date: string;
  title: string;
  category: string;
  url?: string;
}

export interface Section {
  id: string;
  heading?: string;
  body: string[];
  projects?: Project[];
  entries?: Entry[];
  records?: Record[];
  collapsed?: boolean;
}

export const sections: Section[] = [
  {
    id: "about",
    body: [
      "My name is Jason. I’m an engineer first, designer second. I’m based in New York City. I graduated Santa Cruz at 20, and worked previously in San Francisco, Seoul, Pennsylvania, and Santa Cruz.",
      "My [works](+records) are displayed below.",
      "I’m #43,020 on Beli right now. I join runs for basketball near Lower East Side often. I play tennis and pickleball socially. My closet is compiled from Acne Studios, Enfants Riches Déprimés, COS, Our Legacy, No Maintenance, Blackmerle, Chrome Hearts, and more. I model commercial rarely. I enjoy playing with fabrics through repair or experiment. I also like conceptually designing for my favorite artists and things. I watch a lot of [anime](https://anilist.co/user/vznh) and read a lot of manga and manhwa. I [write on an irregular cadence](https://venh.substack.com), and inversely am introductory to reading books. I host events with my friends, from home cafes to DJ sets. I play games recreationally, but used to be #479 on VALORANT for a brief amount of time.",
      "The best ways to reach out are through my [e-mail](mailto:jasonvinhson@gmail.com), or through my [Twitter](https://x.com/jasonvinhson). I’m least accessible through my [LinkedIn](https://linkedin.com/in/vznh). I often create for myself and friends, or contribute to open-source on [GitHub](https://github.com/vznh) like [Repomix](https://github.com/yamadashy/repomix), [biome](https://github.com/biomejs/biome), [Zed](https://github.com/zed-industries/zed/fork), and [bb](https://github.com/get-bb/bb).",
      "I do engineering, research, and design in New York. I used to do systems and interfacing at Apple. I started two [start-ups](+antecedents) and sold one. Then machine learning at Carnegie Mellon, Seoul National, Santa Cruz. Leading up to and in university, full-stack engineering for an urban engineering start-up as one of two interns.",
      "I can tell a further tale about my [provenance](+provenance).",
    ],
  },
  {
    id: "records",
    heading: "Records",
    collapsed: true,
    body: [],
    records: [
      { date: "09 2026", title: "Famish", category: "Personal" },
      { date: "08 2026", title: "Capt", category: "Personal" },
      { date: "08 2026", title: "Transmute", category: "Personal" },
      { date: "08 2026", title: "Agamemnon", category: "Venture" },
      { date: "08 2026", title: "Charms", category: "Personal" },
      { date: "08 2026", title: "Corgi", category: "Commission" },
      { date: "08 2026", title: "Britnie", category: "Commission" },
      { date: "08 2026", title: "5f", category: "Venture" },
      { date: "08 2026", title: "[unnamed]", category: "Commission" },
    ],
  },
  {
    id: "antecedents",
    heading: "Antecedents",
    collapsed: true,
    body: [],
    projects: [
      {
        name: "Polyglot",
        description:
          "Learn languages through bite-sized modules that mimic assimilation. We teach reading, writing, typing, and verbal conversation.",
      },
      {
        name: "Tokn",
        description: "Trade, track, and chat coins in one app.",
      },
    ],
  },
  {
    id: "provenance",
    heading: "Provenance",
    collapsed: true,

    body: ["Over the course of 9 years, I started 102 projects, finished 52, and launched 24 of them."],
    entries: [
      {
        year: "2017",
        blocks: [
          "I bought fake Supreme in middle school. Got made fun of and fed up. I taught myself Python, then automated it. Ended up selling it on OGUsers for a set price, and transacted around 300. This all funneled back into reselling, and I dealt Off-White, Supreme, Anti-Social-Social-Club, and the like.",
        ],
      },
      {
        year: "2018",
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
];
