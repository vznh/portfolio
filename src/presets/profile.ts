export interface Location {
  name: string;
  timeZone: string;
}

export interface Profile {
  name: string;
  intro: string;

  locations: Location[];

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
