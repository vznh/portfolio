// presets/socials

export interface SocialLink {
  href: string;
  label: string;
  // Opens in a new tab; the mailto handoff stays in place.
  external?: boolean;
}

export const socials: SocialLink[] = [
  { href: "mailto:jasonvinhson@gmail.com", label: "jasonvinhson@gmail.com" },
  { href: "https://x.com/jasonvinhson", label: "@jasonvinhson", external: true },
  { href: "https://linkedin.com/in/vznh", label: "in/vznh", external: true },
  { href: "https://github.com/vznh", label: "github/vznh", external: true },
  { href: "https://venh.substack.com", label: "venh.substack.com", external: true },
];
