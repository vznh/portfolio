export interface Location {
  name: string;
  timeZone: string;
}

export interface Profile {
  name: string;
  intro: string;
  // Right column. First entry renders at full opacity, the rest at 40%.
  // Each shows a live HH:MM:SS clock for its IANA time zone.
  locations: Location[];
  // Source repository; the commit SHA on the page links into it.
  repoUrl: string;
}

export const profile: Profile = {
  name: "Jason Son",
  intro:
    "Engineer and designer. Currently at Paradigm, working with a portfolio company. Previously Apple.",
  locations: [
    { name: "Manhattan", timeZone: "America/New_York" },
    { name: "San Francisco", timeZone: "America/Los_Angeles" },
    { name: "San Jose", timeZone: "America/Los_Angeles" },
  ],
  repoUrl: "https://github.com/vznh/portfolio",
};
