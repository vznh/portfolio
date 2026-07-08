// views/
import Crypted from "@/components/Crypted";
import ExperimentSection from "@/components/ExperimentSection";
import Focus from "@/components/Focus";
import ImageOverlay from "@/components/ImageOverlay";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHoverContext } from "@/hooks/useHoverContext";
import { useVersion } from "@/hooks/useVersion";
import { FEATURES } from "@/presets/features";
import { THEMES } from "@/presets/theme";
import { EyeIcon, MailIcon } from "@/presets/svgs";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const IndexView = () => {
  const { registerSection, getOpacity, getTransition } = useActiveSection(3000);
  const { focusedItem } = useHoverContext();
  const version = useVersion();
  const [showCrypted, setShowCrypted] = React.useState(false);
  const hasStartedRef = React.useRef(false);
  const [hoveredAnchor, setHoveredAnchor] = React.useState<null | 'vc' | 'sc' | 'sf'>(null);
  const [eyeHovered, setEyeHovered] = React.useState(false);
  const [mailHovered, setMailHovered] = React.useState(false);
  const [themeIndex, setThemeIndex] = React.useState(0);
  const [dimAnimating, setDimAnimating] = React.useState(false);
  const [footerRevealed, setFooterRevealed] = React.useState(false);
  const footerRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    const theme = THEMES[themeIndex % THEMES.length];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--highlight', theme.highlight);
  }, [themeIndex]);


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

  React.useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current) return;

      const rect = footerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
      const threshold = viewportHeight * 0.6;

      const shouldShow = distanceFromCenter <= threshold;

      if (shouldShow && !hasStartedRef.current) {
        hasStartedRef.current = true;
        setShowCrypted(true);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Dimming is derived from the active anchor and applied declaratively below.
  // A non-mouse pointer (touch/pen) toggles the anchor on tap, since synthetic
  // mouseenter/mouseleave events don't fire reliably on touch devices.
  const DIM_OPACITY = 0.1;
  const dimTransition = "transition-opacity duration-500 ease-in-out";

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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ImageOverlay visible={hoveredAnchor === 'sc'} images={["/images/overlays/santa-cruz.jpg"]} scale={1.25} aspectRatio="16/9" zoom={1.25} objectPosition="center bottom" origin="bottom" />
      <ImageOverlay
        visible={hoveredAnchor === 'sf'}
        images={["/images/overlays/san-francisco.jpg", "/images/overlays/san-francisco-2.jpg"]}
        aspectRatio="16/9"
      />
      <div className="main-content flex flex-col px-[5%] py-[10%] md:py-[5%] md:px-[20%] gap-y-2 pb-[200px] bg-[var(--bg-color)]">
        <div className="w-full flex flex-row justify-between items-start">
          <div className="flex flex-col gap-y-2">
            <h1
              className={`font-lora text-4xl tracking-tight text-[var(--text-color)] ${dimTransition}`}
              style={{ opacity: blockOpacity }}
            >
              Jason Son
            </h1>
            <span className="font-plex text-xl tracking-tight text-[var(--text-color)] vc-tagline">
              <span className={`opacity-50 ${dimTransition}`} style={{ opacity: mutedOpacity }}>Engineer and </span>
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
                  desc="I invest in consumer-facing apps or artificial intelligence labs."
                />
              </span>
              <span className={`opacity-50 ${dimTransition}`} style={{ opacity: mutedOpacity }}> at 22. Based in New York City as a researcher and full-stack generalist. I graduated </span>
              <span
                className={`link sc-anchor ${dimTransition}`}
                style={{ opacity: anchorOpacity('sc') }}
                {...anchorHandlers('sc')}
              >
                Santa Cruz
              </span>
              <span className={`opacity-50 ${dimTransition}`} style={{ opacity: mutedOpacity }}> at 20, and worked previously in </span>
              <span
                className={`link sf-anchor ${dimTransition}`}
                style={{ opacity: anchorOpacity('sf') }}
                {...anchorHandlers('sf')}
              >
                San Francisco
              </span>
              <span className={`opacity-50 ${dimTransition}`} style={{ opacity: mutedOpacity }}>.</span>
            </span>
            <div className="h-2" />
            <div
              className={`social-row flex flex-row items-center gap-x-3 text-[var(--text-color)] ${dimTransition}`}
              style={{ opacity: blockOpacity }}
            >
              <Link href="https://x.com/jasonvinhson" target="_blank" className="opacity-50 transition-all duration-200 hover:opacity-100 hover:text-[#222]">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="https://linkedin.com/in/vznh" target="_blank" className="opacity-50 transition-all duration-200 hover:opacity-100 hover:text-[#222]">
                <LinkedInLogoIcon width={23} height={23} />
              </Link>
              <Link href="https://github.com/vznh" target="_blank" className="opacity-50 transition-all duration-200 hover:opacity-100 hover:text-[#222]">
                <GitHubLogoIcon width={23} height={23} />
              </Link>
              <Link href="https://venh.substack.com" target="_blank" className="opacity-50 transition-all duration-200 hover:opacity-100 hover:text-[#222]">
                <svg width="23" height="23" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {FEATURES.work && (
          <>
            <div className="h-12" />

            <motion.div
              ref={registerSection("work")}
              data-section="work"
              className="work-section-container flex flex-col gap-y-3"
              initial={{ opacity: 0.05 }}
              animate={{ opacity: hoveredAnchor ? 0.1 : focusedItem ? 1 : (getOpacity("work") ?? 1) }}
              exit={{ opacity: 0 }}
              transition={dimAnimating ? { duration: 0.5, ease: "easeInOut" } : getTransition({
                delay: 1,
                duration: 0.8,
                ease: "easeInOut",
              })}
            >
              <div
                className={`flex flex-row justify-between ${dimTransition}`}
                style={{ opacity: focusedItem ? DIM_OPACITY : 1 }}
              >
                <span className="font-plex font-normal tracking-tight opacity-50 text-[var(--text-color)]">
                  Antecedents
                </span>
                <span className="font-plex font-normal tracking-tight opacity-50 text-[var(--text-color)]">
                  Discipline
                </span>
              </div>
              <WorkSection />
            </motion.div>
          </>
        )}

        {FEATURES.projects && (
          <>
            <div className="h-16" />
            <motion.div
              ref={registerSection("projects")}
              data-section="projects"
              initial={{ opacity: 0.05 }}
              animate={{ opacity: (hoveredAnchor || focusedItem) ? 0.1 : (getOpacity("projects") ?? 1) }}
              exit={{ opacity: 0 }}
              transition={dimAnimating ? { duration: 0.5, ease: "easeInOut" } : getTransition({
                delay: 1.3,
                duration: 1.0,
                ease: "easeInOut",
              })}
              className="flex flex-col gap-y-4"
            >
              <span className="font-plex font-normal tracking-tight opacity-50 text-[var(--text-color)]">
                Projects
              </span>
              <ExperimentSection />
            </motion.div>
          </>
        )}

        {/* This section should lowkey typewrite out itself */}
        <div className="h-24" />

        <motion.footer
          ref={footerRef}
          className="relative flex w-full justify-center h-[200px] md:h-[500px] md:mb-[-350px]"
          initial={{ opacity: 0.05 }}
          animate={{ opacity: (hoveredAnchor || focusedItem) ? DIM_OPACITY : (footerRevealed ? 1 : 0.05) }}
          transition={{ duration: dimAnimating ? 0.5 : 1.0, ease: "easeInOut" }}
        >
          <div className="absolute top-4 md:top-20 left-0 flex flex-col gap-y-2">
            <motion.div
              className="flex flex-row items-center space-x-2 group"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onMouseEnter={() => setMailHovered(true)}
              onMouseLeave={() => setMailHovered(false)}
            >
              <Link
                href="mailto:jasonvinhson@gmail.com"
                className="font-jb text-xs tracking-tight text-[var(--text-color)]"
              >
                {showCrypted ? (
                  <Crypted text="REQUEST A RESUME" delay={15} />
                ) : (
                  "REQUEST A RESUME"
                )}
              </Link>{" "}
              <span className="relative flex items-center">
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.7, scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{
                    boxShadow: "0 0 16px 8px rgba(255, 255, 255, 0.5)",
                    filter: "blur(4px)",
                  }}
                />
                <div className="relative z-10">
                  <MailIcon open={mailHovered} />
                </div>
              </span>
            </motion.div>

            <motion.div
              className="flex flex-row items-center space-x-2 group"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onMouseEnter={() => setEyeHovered(true)}
              onMouseLeave={() => setEyeHovered(false)}
            >
              <Link
                href="https://cal.com/jason-son-suncdj/15min"
                className="font-jb text-xs tracking-tight text-[var(--text-color)]"
              >
                {showCrypted ? (
                  <Crypted text="BOOK A CALL" delay={15} />
                ) : (
                  "BOOK A CALL"
                )}
              </Link>{" "}
              <span className="relative flex items-center">
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none z-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.7, scale: 1.2 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{
                    boxShadow: "0 0 16px 8px rgba(255, 255, 255, 0.5)",
                    filter: "blur(4px)",
                  }}
                />
                <div className="relative z-10">
                  <EyeIcon closed={eyeHovered} />
                </div>
              </span>
            </motion.div>
          </div>

          <div className="absolute top-20 right-0 hidden md:flex flex-col gap-y-2">
            <motion.div
              className="group"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Link
                href="https://github.com/vznh/mole/releases/"
                className="font-jb text-xs tracking-tight hover:underline decoration-dashed underline-offset-4 text-[var(--text-color)]"
              >
                {showCrypted ? (
                  <>
                    <Crypted text={`Version ${version}`} delay={15} />
                    , <Crypted text="April 2026" delay={15} />
                  </>
                ) : (
                  <>
                    Version {version}, April 2026
                  </>
                )}
              </Link>{" "}
              <span className="text-[var(--text-color)] text-[11px] inline-block transition-transform duration-300 ease-out group-hover:-rotate-45">→</span>
            </motion.div>
          </div>

          <div className="absolute top-24 md:hidden left-0 flex flex-col gap-y-2">
            <motion.div
              className="group"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 0.7 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Link
                href="https://github.com/vznh/mole/releases/"
                className="font-jb text-xs tracking-tight hover:underline decoration-dashed underline-offset-4 text-[var(--text-color)]"
              >
                {showCrypted ? (
                  <>
                    <Crypted text={`Version ${version}`} delay={15} />
                    , <Crypted text="April 2026" delay={15} />
                  </>
                ) : (
                  <>
                    Version {version}, April 2026
                  </>
                )}
              </Link>{" "}
              <span className="text-[var(--text-color)] text-[11px] inline-block transition-transform duration-300 ease-out -rotate-45">→</span>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default IndexView;
