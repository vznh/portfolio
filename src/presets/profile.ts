export interface ProfileImage {
  src: string; // served from /public, e.g. "/images/portrait.jpg"
  alt: string;
  width: number; // intrinsic pixels, used for aspect ratio
  height: number;
}

export interface Profile {
  name: string;
  intro: string;
  // Right column. First entry renders at full opacity, the rest at 40%.
  locations: string[];
  // Left column image. Leave undefined to render a neutral placeholder.
  image?: ProfileImage;
}

export const profile: Profile = {
  name: "Jason Son",
  intro:
    "Engineer and designer. Currently at Paradigm, working with a portfolio company. Previously Apple.",
  locations: ["Manhattan", "San Francisco", "San Jose"],
  // image: { src: "/images/portrait.jpg", alt: "Jason Son", width: 1200, height: 1500 },
};
