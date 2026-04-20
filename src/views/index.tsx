// views/
import Crypted from "@/components/Crypted";
import ExperimentSection from "@/components/ExperimentSection";
import Focus from "@/components/Focus";
import ImageOverlay from "@/components/ImageOverlay";
import Logo from "@/components/Logo";
import WorkSection from "@/components/WorkSection";
import { useActiveSection } from "@/hooks/useActiveSection";
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
  const version = useVersion();
  const [showCrypted, setShowCrypted] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [hoveredAnchor, setHoveredAnchor] = React.useState<null | 'vc' | 'sc' | 'sf'>(null);
  const [eyeHovered, setEyeHovered] = React.useState(false);
  const [mailHovered, setMailHovered] = React.useState(false);
  const [themeIndex, setThemeIndex] = React.useState(0);
  const [dimAnimating, setDimAnimating] = React.useState(false);
  const footerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hoveredAnchor) {
      setDimAnimating(true);
      return;
    }
    const timer = setTimeout(() => setDimAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [hoveredAnchor]);

  React.useEffect(() => {
    const theme = THEMES[themeIndex % THEMES.length];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bg);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--highlight', theme.highlight);
  }, [themeIndex]);

  const cycleTheme = () => setThemeIndex((i) => (i + 1) % THEMES.length);

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

      if (shouldShow && !hasStarted) {
        setHasStarted(true);
        setShowCrypted(true);
      }

      if (hasStarted) {
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

  React.useEffect(() => {
    const duration = '0.5s ease-in-out';
    const targetSelectors = [
      '.main-content h1',
      '.main-content .social-row',
      'footer',
    ];
    const targets: HTMLElement[] = [];
    targetSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => targets.push(el as HTMLElement));
    });

    const activeClass = hoveredAnchor ? `${hoveredAnchor}-anchor` : null;
    const siblings: HTMLElement[] = [];
    document.querySelectorAll('.vc-tagline > *').forEach((el) => {
      if (!activeClass || !el.classList.contains(activeClass)) {
        siblings.push(el as HTMLElement);
      }
    });

    const apply = (el: HTMLElement) => {
      el.style.setProperty('transition', `opacity ${duration}`, 'important');
      if (hoveredAnchor) {
        el.style.setProperty('opacity', '0.1', 'important');
      } else {
        el.style.removeProperty('opacity');
      }
    };

    targets.forEach(apply);
    siblings.forEach(apply);

    return () => {
      targets.forEach((el) => {
        el.style.removeProperty('opacity');
        el.style.removeProperty('transition');
      });
      siblings.forEach((el) => {
        el.style.removeProperty('opacity');
        el.style.removeProperty('transition');
      });
    };
  }, [hoveredAnchor]);

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
            <h1 className="font-lora text-4xl tracking-tight text-[var(--text-color)]">
              Jason Son
            </h1>
            <span className="font-plex text-xl tracking-tight text-[var(--text-color)] vc-tagline">
              <span className="opacity-50">Engineer and </span>
              <span
                className="relative inline-block vc-anchor"
                onMouseEnter={() => setHoveredAnchor('vc')}
                onMouseLeave={() => setHoveredAnchor(null)}
              >
                <span className="link">venture capitalist</span>
                <Focus
                  visible={hoveredAnchor === 'vc'}
                  date="2026"
                  role="(1) COMPANY"
                  desc="I invest in consumer-facing apps or artificial intelligence labs."
                />
              </span>
              <span className="opacity-50"> at 21. Based in New York City as a researcher and full-stack generalist. I was previously at </span>
              <span
                className="link sc-anchor"
                onMouseEnter={() => setHoveredAnchor('sc')}
                onMouseLeave={() => setHoveredAnchor(null)}
              >
                Santa Cruz
              </span>
              <span className="opacity-50"> and in </span>
              <span
                className="link sf-anchor"
                onMouseEnter={() => setHoveredAnchor('sf')}
                onMouseLeave={() => setHoveredAnchor(null)}
              >
                San Francisco
              </span>
              <span className="opacity-50">.</span>
            </span>
            <div className="h-2" />
            <div className="social-row flex flex-row items-center gap-x-3 text-[var(--text-color)]">
              <Link href="https://x.com/@vivivinh" target="_blank" className="opacity-50 transition-all duration-200 hover:opacity-100 hover:text-[#222]">
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
              animate={{ opacity: hoveredAnchor ? 0.1 : (getOpacity("work") ?? 1) }}
              exit={{ opacity: 0 }}
              transition={dimAnimating ? { duration: 0.5, ease: "easeInOut" } : getTransition({
                delay: 1,
                duration: 0.8,
                ease: "easeInOut",
              })}
            >
              <div className="flex flex-row justify-between">
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
              animate={{ opacity: hoveredAnchor ? 0.1 : (getOpacity("projects") ?? 1) }}
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

        <footer
          ref={footerRef}
          className="relative flex w-full justify-center h-[200px] md:h-[500px] md:mb-[-350px]"
        >
          <div className="hidden md:block">
            <Logo width={500} height={400} className="-rotate-[30deg]" onClick={cycleTheme} />
          </div>

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

          <div className="absolute top-16 md:hidden left-0 flex flex-col gap-y-2">
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
        </footer>
      </div>
    </div>
  );
};

export default IndexView;
