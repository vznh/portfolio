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
