export interface ProfileImage {
  src: string; // served from /public, e.g. "/images/portrait.jpg"
  alt: string;
  width: number; // intrinsic pixels, used for aspect ratio
  height: number;
}

export interface Profile {
  name: string;
  intro: string;
  location: string;
  // Left column image. Leave undefined to render a neutral placeholder.
  image?: ProfileImage;
}

export const profile: Profile = {
  name: "Jason Son",
  intro:
    "Engineer and designer. Currently at Paradigm, working with a portfolio company. Previously Apple.",
  location: "Brooklyn, New York",
  // image: { src: "/images/portrait.jpg", alt: "Jason Son", width: 1200, height: 1500 },
};
