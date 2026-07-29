// Content for the "Provenance" section. The story reads oldest-to-newest.
// Accent parts are colored; those with a URL are also links.

export interface ProvenanceMedia {
  type: "image" | "video";
  src: string;
}

export interface ProvenanceAccent {
  text: string;
  url?: string;
  // Shown in the reading-bar reveal frame; linked accents without media get a placeholder.
  media?: ProvenanceMedia;
}

export type ProvenanceStoryPart = string | ProvenanceAccent;

export const oldestFirstStory: ProvenanceStoryPart[][] = [
  [
  "I started off ",
  { text: "making bots in middle school" },
  " to buy streetwear and resell (asshole...). They automated the entire process from item to cart to checkout, beating humans and existing bots. Then tried ",
  {
    text: "reverse-engineering a ROBLOX hack",
    url: "https://www.youtube.com/watch?v=xdWOZRxQvxo",
    media: { type: "image", src: "/images/provenance/roblox-hack.png" },
  },
  " because I was greedy. The GUI allowed me to spawn only one item at a time, and I wanted a large quantity. I also used to cheat on TF2 with a skin changer I made. ",
  { text: "I got caught though.", url: "https://steamcommunity.com/id/vinh2/" },
  " I started experimenting with Discord bots for my friend group at this time for anime references (like Mudae!). I tinkered with robotics in high school, first with a ",
  { text: "computer jukebox" },
  " for my first love. It was an end-to-end system: RFID cards mapped to songs, an external speaker, and its own separate Spotify account. In the same year, I ",
  { text: "made a quick NFC tag that translated everyday news locally and relative cross-country into Vietnamese for my mom" },
  " (she still uses it!). I was old enough for hackathons then. I won categories at HackDavis and CalHacks, and became a finalist at TreeHacks. I was caught off of the high of building. I started a company named Tokn with my mentor for a ",
  { text: "social layer over token analytics" },
  ", similar to Twitch chat for people watching their favorite coin. We got 2K+ users within the first 24 hours. We sold the app.",
  ],
  [
  "I made stuff for my roommates. A ",
  { text: "simple LED sign that indicates if someone's in their room or not" },
  " that helped us know who was home and who wasn't. An automatic ",
  { text: "door lock and unlocker" },
  ". And then I got into davinci-002 and gpt-3.5-turbo. I spent my last $30 on inference just fiddling with them. I pitched to a professor and ended up helping build the entire pipeline for ",
  { text: "research on a text-to-video generative model" },
  ". I'm inspired by my sisters, so I wanted to pursue medicine too. I ended up doing research domestically, building machine learning models to automate grunt work at Carnegie Mellon for neurology, and internationally at Seoul National for genealogy. I started a new start-up about ",
  { text: "language learning with heavy assimilation" },
  ". I failed, but learned a lot by picking myself up. My favorite hackathon project was a ",
  { text: "CLI that resolved bugs through errors and PR checks", url: "https://github.com/ehcaw/splat" },
  ". I was interested in theoretical mathematics, and took an entire 2 quarters to do Chaos Theory, Number Theory, Topology, and Real Analysis. I liked it. Then looked more into quant. Participated in a trading challenge with 30,000 participants and finished top 500 in the first round. My friend thought computer science meant everyone could design too. He paid me 500 buckaroos to ",
  { text: "design a website" },
  " for his health club. It was my first design, and it was crude. I ended up spending 10X the time I told him I would allocate to it. I fell in love with designing.",
  ],
  [
  "My friends are planners, so I made the first app to ",
  {
    text: "create bulk calendar entries with just a normal sentence",
    url: "https://x.com/jasonvinhson/status/1915190716151849076",
  },
  ". They found themselves allocating time to make events, which is ironic because in order to create time, you must block it out. But they found themselves blocking out time just to plan. It was my first work of app design. My friends used it in 2024. I released it to the public in 2025. I made an ",
  { text: "app for my campus to replace the map system and introduce a new social layer" },
  " (which was promptly shut down because it exposed paths that were dangerous and not publicly accessible). Turns out I yearned for a sense of community at Santa Cruz. Each housing community was a ways from the others, and events weren't easily accessible. I wanted a community of like-minded people. I started ",
  { text: "co-working events", url: "https://luma.com/user/vinh" },
  ". I ended up experimenting with design. I made an ",
  { text: "old portfolio website with a shader I created", url: "https://old.hobin.dev" },
  ". Then used ",
  { text: "vision as a new interface" },
  ", using my hands through vision to navigate websites. Didn't work out. I made ",
  { text: "websites for free for small businesses around Santa Cruz" },
  " (inquire about this!). Tried ",
  { text: "starting a club to continue my tradition" },
  ". Didn't work out either. I graduated in 2.5 years.",
  ],
  [
  "Made a ",
  {
    text: "terminal app that told me what to invest in, for topics that are native to me",
  },
  " (e.g. design industry, robotics, politics, ...). Got a Tesla, then started tinkering with it. I wanted to see what I could make it do. I ended up tinkering with it so ",
  { text: "the doors would open when the NFC is within proximity" },
  " (similarly to old models!). On the side, I started a ",
  { text: "small design agency for my coterie" },
  ", a term I use for my close companions. My cool clients include frontier labs to fashion collectives. I ended up making ",
  { text: "components of my favorite pieces", url: "https://github.com/vznh/devour" },
  " in all of my designs. ",
  {
    text: "I made a tool proven to reduce tool calls and token usage by 75% and 90% respectively, based on exact queries tested with and without the package.",
    url: "https://github.com/vznh/axiomarc",
  },
  " At xAI, I made a ",
  { text: "tool to replicate designs layer-by-layer instead of inferring layer structure from a flattened image" },
  ".",
  ],
  [
  "I'm selfish. I made a lot of stuff for myself. I save food videos, so ",
  { text: "why not make it into recipes", url: "https://github.com/vznh/hungry" },
  "? Then ",
  {
    text: "made a performativeness test for myself and friends",
    url: "https://grandiose-five.vercel.app/",
  },
  ". Someone made a better version though. I love music. I got curious and wanted to see the ",
  {
    text: "overlap between music tastes instead of Spotify's blackbox",
    url: "https://x.com/jasonvinhson/status/1974311707138011515",
  },
  ". Made ",
  {
    text: "mock-ups for potential UI",
    url: "https://x.com/jasonvinhson/status/2001431839064592836",
  },
  " too. I started ",
  { text: "writing blogs", url: "https://venh.substack.com/" },
  ". And ",
  { text: "made an API when it didn't exist", url: "https://github.com/vznh/substack" },
  " for Substack, exposing articles as text and content alongside profile data, for my own website. Then I wanted to looksmax. I ",
  {
    text: "made a Discord bot for my friends and I",
    url: "https://github.com/vznh/conviction",
    media: { type: "video", src: "/images/projects/experiments/75.mp4" },
  },
  " to keep us accountable. It was a 75-day commitment with a $20 entry. If you failed, you lost. If you committed through the end, the winners split the pot. The bot kept track of everything and pinged users toward the end of the day. I love unreleased music. I ",
  { text: "made a bulk converter" },
  " that takes YouTube and SoundCloud links, then researches the web to assign proper metadata.",
  ],
  [
  "I love my friends too. I made a ",
  { text: "tool to constantly record captions" },
  " that overlay on your screen. I fitted it for bionic reading for my dyslexic friend. Then, made ",
  { text: "some stuff about checking-in with each other over an inside joke" },
  ". If one of my friends entered a certain section of California, the Bay Area, specifically Fremont or Milpitas, a ping would go to each other's phones: \"Jason just entered your territory...\" and required the user to \"check-in\" with the owner of that territory. I own New York. ",
  { text: "Interactive invites and designs for home cafes, or large hangouts" },
  ". A ",
  { text: "business card for the conference they went to so they could strike an impression" },
  ". A ",
  { text: "karaoke machine that links between phone and computer" },
  ". ",
  { text: "NFC tags with a Spotify playlist that I programmed with a new algo to change everyday on genres we both want to explore." },
  " Should I tell you more?",
  ],
];

// Muted accents stay legible against the site's light themes.
export const MUTED_PALETTE: string[] = [
  "#A67B7B",
  "#7B9E89",
  "#C08552",
  "#6B7B9E",
  "#9E7B94",
  "#5E8B87",
  "#B08968",
  "#8A9A5B",
];
