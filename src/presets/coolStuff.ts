// Content for the "Provenance" section. The story reads oldest-to-newest.
// Accent parts are colored; those with a URL are also links.

export interface CoolStuffAccent {
  text: string;
  url?: string;
}

export type CoolStuffStoryPart = string | CoolStuffAccent;

export const oldestFirstStory: CoolStuffStoryPart[][] = [
  [
  "I started off ",
  { text: "making bots in middle school" },
  " to buy streetwear and resell (asshole...). Then tried ",
  { text: "reverse-engineering Magitan", url: "https://www.youtube.com/watch?v=xdWOZRxQvxo" },
  ". I made ",
  { text: "Discord bots for my friends" },
  " for a while. I finkered with robotics in high school, first with a ",
  { text: "computer jukebox" },
  " for my first love in high school. In the same year, ",
  { text: "made a quick NFC tag for my mom to read the local news in Vietnamese" },
  " (she still uses it!). I was old enough for hackathons then. I won in categories for HackDavis and CalHacks, and finalists for TreeHacks. I was caught off of the high of building. I started a company named Tokn with my mentor for a ",
  { text: "social layer over token analytics" },
  ". I exited.",
  ],
  [
  "I made stuff for my roommates. A ",
  { text: "simple LED sign that indicates if someone's in their room or not" },
  ". An automatic ",
  { text: "door lock and unlocker" },
  ". And got into davinci-002 for a bit. I pitched to a professor and ended up starting ",
  { text: "research on a text-to-video generative model" },
  ". I'm inspired by my sisters, so I wanted to pursue medicine too. I ended up starting ",
  { text: "research domestically and internationally for neurology, genealogy respectively" },
  ". I started a new start-up with my friends, failed, and learned for ",
  { text: "language learning with assimilation" },
  ". My favorite hackathon project was a ",
  { text: "CLI that resolved bugs through errors and PR checks", url: "https://github.com/ehcaw/splat" },
  " (we didn't hear of Greptile...). I was interested in theoretical mathematics. I took an entire 2 quarters to do Chaos Theory, Number Theory, Topology, Real Analysis. I liked it. My friend thought computer science encompasses design too. He paid me $500 to ",
  { text: "design a website" },
  ". I did it, it looked bad. I ended up spending 10X the time I told him I would allocate to it. I fell in love.",
  ],
  [
  "My friends are planners, so I made the first app to ",
  {
    text: "create bulk calendar entries with just a normal sentence",
    url: "https://x.com/jasonvinhson/status/1915190716151849076",
  },
  ". It was my first work of app design. I released it to the public in 2025. I made an ",
  { text: "app for my campus to replace the map system and introduce a new social layer" },
  " (which was promptly shut down). Turns out I yearned for a sense of community at Santa Cruz. I started ",
  { text: "co-working events", url: "https://luma.com/user/vinh" },
  ". Work hard, play hard. I ended up experimenting with design. I made an ",
  { text: "old portfolio website with a shader I created", url: "https://old.hobin.dev" },
  ". Then used ",
  { text: "vision as a new interface" },
  ". Didn't work out. I made ",
  { text: "websites for free for small businesses around Santa Cruz" },
  " (inquire about this!). Tried ",
  { text: "starting a club to continue my tradition" },
  ". Didn't work. I graduated in 2.5 years.",
  ],
  [
  "Then worked out in TradFi. Made a ",
  {
    text: "terminal app that told me what to invest in, for topics that are native to me",
  },
  " (e.g. design industry, robotics, politics, ...). Then looked more into quant. Participated in a trading challenge and finished top 500 in the first round. Got a Tesla then started tinkering with it. I ended up tinkering with it so ",
  { text: "the doors would open when the NFC is within proximity" },
  " (similarly to old models!). On the side, I started a ",
  { text: "small design agency for coterie" },
  ". My cool clients include frontier labs to fashion collectives. I ended up making ",
  { text: "components of my favorite pieces", url: "https://github.com/vznh/devour" },
  " in all of my designs. ",
  {
    text: "I made a tool proven to reduce tool calls and token usage by 75%, 90% respectively.",
    url: "https://github.com/vznh/axiomarc",
  },
  " Then at xAI, a ",
  { text: "tool to replicate designs layer-by-layer instead of graphical surfacing" },
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
  " for Substack for my own website. Then I wanted to looksmax. I ",
  { text: "made a Discord bot for my friends and I", url: "https://github.com/vznh/conviction" },
  " to keep us accountable. I love unreleased music. I ",
  { text: "made a bulk converter" },
  " that automates the hard work for me.",
  ],
  [
  "I love my friends too. My friend is dyslexic, and I made an ",
  { text: "audio-to-text constant caption" },
  ". Then, made ",
  { text: "some stuff about checking-in with each other over an inside joke" },
  ". ",
  { text: "Interactive invites and designs for home cafes, or large hangouts" },
  ". A ",
  { text: "business card for the conference they went to so they can strike an impression" },
  ". A ",
  { text: "karaoke machine that links between phone and computer" },
  ". ",
  { text: "Charms with a variable playlist for a girl I like" },
  ". There's so much more you won't know!",
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
