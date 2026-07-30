// views/
import ProvenanceSection from "@/components/ProvenanceSection";
import ExperimentSection from "@/components/ExperimentSection";
import Focus from "@/components/Focus";
import Footer from "@/components/Footer";
import ImageOverlay from "@/components/ImageOverlay";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHoverContext } from "@/hooks/useHoverContext";
import { useNearViewportCenter } from "@/hooks/useNearViewportCenter";
import { FEATURES } from "@/presets/features";
import { socials } from "@/presets/socials";
import { LazyMotion, domMax, m } from "framer-motion";
import Link from "next/link";
import React from "react";

const DIM_OPACITY = 0.1;
const dimTransition = "transition-opacity duration-500 ease-in-out";
const SECTION_LABEL_CLASS =
  "font-plex font-normal tracking-tight opacity-50 text-[var(--text-color)]";

// Tagline prose and section headings both fade as one block; only the resolved
// opacity differs, so the transition class lives in one place.
const Dimmable = ({
  opacity,
  className = "",
  children,
}: {
  opacity: number;
  className?: string;
  children: React.ReactNode;
}) => (
  <span className={`${className} ${dimTransition}`} style={{ opacity }}>
    {children}
  </span>
);

const IndexView = ({ version }: { version: string }) => {
  const { registerSection, getOpacity, getTransition } = useActiveSection(3000);
  const { focusedItem } = useHoverContext();
  const [hoveredAnchor, setHoveredAnchor] = React.useState<null | 'vc' | 'sc' | 'sf'>(null);
  const [dimAnimating, setDimAnimating] = React.useState(false);
  const [footerRevealed, setFooterRevealed] = React.useState(false);
  const footerRef = React.useRef<HTMLDivElement>(null);

  // The footer's scramble plays once, the first time it scrolls into view.
  const showCrypted = useNearViewportCenter(footerRef, {
    threshold: 0.6,
    once: true,
  });

  // One-shot fade-in for the footer once the hero/section reveals have played.
  React.useEffect(() => {
    const timer = setTimeout(() => setFooterRevealed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (hoveredAnchor || focusedItem) {
      setDimAnimating(true);
      return;
    }
    const timer = setTimeout(() => setDimAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [hoveredAnchor, focusedItem]);

  // Dismiss an open header Focus on any tap/click that lands outside the three
  // anchors (empty space, an antecedent row, etc.). Touch devices never fire a
  // pointerleave, so without this an opened Focus would stay stuck until the
  // same word is tapped again.
  React.useEffect(() => {
    if (!hoveredAnchor) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.vc-anchor, .sc-anchor, .sf-anchor')) {
        setHoveredAnchor(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [hoveredAnchor]);

  // Dimming is derived from the active anchor and applied declaratively below.
  // A non-mouse pointer (touch/pen) toggles the anchor on tap, since synthetic
  // mouseenter/mouseleave events don't fire reliably on touch devices.

  // Anything focused — a header anchor or an antecedent row — dims the page.
  const anyFocus = hoveredAnchor !== null || focusedItem !== null;
  // Opacity for an element that is fully lit when idle and dimmed while anything is focused.
  const blockOpacity = anyFocus ? DIM_OPACITY : 1;
  // Opacity for the muted ("opacity-50") tagline text.
  const mutedOpacity = anyFocus ? DIM_OPACITY : 0.5;
  // Opacity for an anchor: itself stays lit, the others dim when anything is focused.
  const anchorOpacity = (self: 'vc' | 'sc' | 'sf') =>
    anyFocus && hoveredAnchor !== self ? DIM_OPACITY : 1;

  const anchorHandlers = (anchor: 'vc' | 'sc' | 'sf') => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHoveredAnchor(anchor);
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHoveredAnchor(null);
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        setHoveredAnchor((prev) => (prev === anchor ? null : anchor));
      }
    },
  });

  // Every scroll-revealed section shares the same entrance: near-invisible until
  // the staggered reveal, then driven by whichever section is most in view. Only
  // the resolved opacity and the stagger timing differ per section.
  const sectionMotion = (
    id: string,
    opacity: number,
    delay: number,
    duration: number,
  ) => ({
    ref: registerSection(id),
    "data-section": id,
    initial: { opacity: 0.05 },
    animate: { opacity },
    exit: { opacity: 0 },
    transition: dimAnimating
      ? { duration: 0.5, ease: "easeInOut" }
      : getTransition({ delay, duration, ease: "easeInOut" }),
  });

  return (
    <LazyMotion features={domMax}>
    <div className="relative min-h-screen overflow-hidden">
      <ImageOverlay visible={hoveredAnchor === 'sc'} images={["/images/overlays/santa-cruz.jpg"]} scale={1.25} aspectRatio="16/9" zoom={1.25} objectPosition="center bottom" origin="bottom" />
      <ImageOverlay
        visible={hoveredAnchor === 'sf'}
        images={["/images/overlays/san-francisco.jpg", "/images/overlays/san-francisco-2.jpg"]}
        aspectRatio="16/9"
      />
      <div className="main-content flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[22.5%] gap-y-2 pb-[200px] bg-[var(--bg-color)]">
        <div className="w-full flex flex-row justify-between items-start">
          <div className="flex flex-col gap-y-2">
            <h1
              className={`font-lora text-4xl tracking-tight text-[var(--text-color)] ${dimTransition}`}
              style={{ opacity: blockOpacity }}
            >
              Jason Son
            </h1>
            <span className="font-plex text-xl tracking-tight text-[var(--text-color)] vc-tagline">
              <Dimmable opacity={mutedOpacity}>Engineer and </Dimmable>
              <span
                className={`relative inline-block vc-anchor ${dimTransition}`}
                style={{ opacity: anchorOpacity('vc') }}
                {...anchorHandlers('vc')}
              >
                <span className="link">venture capitalist</span>
                <Focus
                  visible={hoveredAnchor === 'vc'}
                  date="2026"
                  role="(1) COMPANY"
                  desc="I wrote a $10K check and was one of the first wires towards a lab. I am drawn to people with relentless ambition and care about the itty gritty details. I especially love crude ideas."
                />
              </span>
              <Dimmable opacity={mutedOpacity}> at 22. Based in New York City as a researcher and full-stack generalist. I graduated </Dimmable>
              <span
                className={`link sc-anchor ${dimTransition}`}
                style={{ opacity: anchorOpacity('sc') }}
                {...anchorHandlers('sc')}
              >
                Santa Cruz
              </span>
              <Dimmable opacity={mutedOpacity}> at 20, and worked previously in </Dimmable>
              <span
                className={`link sf-anchor ${dimTransition}`}
                style={{ opacity: anchorOpacity('sf') }}
                {...anchorHandlers('sf')}
              >
                San Francisco
              </span>
              <Dimmable opacity={mutedOpacity}>.</Dimmable>
            </span>
            <div className="h-2" />
            <div
              className={`social-row flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-color)] ${dimTransition}`}
              style={{ opacity: blockOpacity }}
            >
              {socials.map(({ href, label, external }) => (
                <Link
                  key={href}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="font-plex font-medium text-base tracking-tight opacity-50 transition-[color,opacity] duration-200 hover:opacity-100 hover:text-[#222]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {FEATURES.work && (
          <>
            <div className="h-12" />

            <m.div
              {...sectionMotion(
                "work",
                hoveredAnchor ? DIM_OPACITY : focusedItem ? 1 : (getOpacity("work") ?? 1),
                1,
                0.8,
              )}
              className="work-section-container flex flex-col gap-y-3"
            >
              <Dimmable
                className="flex flex-row justify-between"
                opacity={focusedItem ? DIM_OPACITY : 1}
              >
                <span className={SECTION_LABEL_CLASS}>Antecedents</span>
                <span className={SECTION_LABEL_CLASS}>Discipline</span>
              </Dimmable>
              <WorkSection />
            </m.div>

            <div className="h-16" />

            <m.div
              {...sectionMotion(
                "provenance",
                hoveredAnchor ? DIM_OPACITY : focusedItem ? 1 : (getOpacity("provenance") ?? 1),
                1,
                0.8,
              )}
              className="provenance-section-container flex flex-col gap-y-3"
            >
              <Dimmable opacity={focusedItem ? DIM_OPACITY : 1}>
                <span className={SECTION_LABEL_CLASS}>Provenance</span>
              </Dimmable>
              <ProvenanceSection />
            </m.div>
          </>
        )}

        {FEATURES.projects && (
          <>
            <div className="h-16" />
            <m.div
              {...sectionMotion(
                "projects",
                (hoveredAnchor || focusedItem) ? DIM_OPACITY : (getOpacity("projects") ?? 1),
                1.3,
                1.0,
              )}
              className="flex flex-col gap-y-4"
            >
              <span className={SECTION_LABEL_CLASS}>Projects</span>
              <ExperimentSection />
            </m.div>
          </>
        )}

        {/* This section should lowkey typewrite out itself */}
        <div className="h-24" />

        <Footer
          footerRef={footerRef}
          opacity={(hoveredAnchor || focusedItem) ? DIM_OPACITY : (footerRevealed ? 1 : 0.05)}
          dimAnimating={dimAnimating}
          showCrypted={showCrypted}
          version={version}
        />
      </div>
    </div>
    </LazyMotion>
  );
};

export default IndexView;
