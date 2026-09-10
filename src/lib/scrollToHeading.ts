import type { MouseEvent } from "react";

export function handleSectionLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;

  const id = event.currentTarget.hash.slice(1);
  if (!document.getElementById(id)) return;

  event.preventDefault();
  scrollToHeading(id);
}

export function scrollToHeading(id: string) {
  const section = document.getElementById(id);
  const heading = section?.querySelector("h2") ?? section;
  if (!heading) return;

  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
  if (window.matchMedia("(max-width: 767px)").matches) {
    window.scrollTo({
      top: window.scrollY + heading.getBoundingClientRect().top - window.innerHeight * 0.25,
      behavior,
    });
  } else {
    heading.scrollIntoView({ behavior, block: "center" });
  }
}
