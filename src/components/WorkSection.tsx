"use client";
// components/WorkSection
import React from "react";
import { experiences } from "@/presets/work";
import Image from "next/image";
import { useHoverContext } from "@/hooks/useHoverContext";
import { useLatest } from "@/hooks/useLatest";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useId } from "react";
import Focus from "./Focus";

// Stable empty default so a row without `images` doesn't get a fresh array each
// render (which would defeat memoization on any child comparing the prop).
const EMPTY_IMAGES: string[] = [];

export interface WorkRowProps {
  key: number;
  company: string;
  role: string;
  img: string;
  imgClassName?: string;

  focusDate?: string;
  focusLocation?: string;
  focusDesc?: string;
  images?: string[];
}

const WorkRow: React.FC<WorkRowProps> = ({
  company,
  role,
  img,
  imgClassName = "",
  focusDate = "",
  focusLocation = "",
  focusDesc = "",
  images = EMPTY_IMAGES
}) => {
  const { hoveredItem, setHoveredItem, focusedItem, setFocusedItem } = useHoverContext();
  const itemId = useId();
  // Read through a ref so crossing the breakpoint mid-hover can't clear and
  // restart the in-flight dimming timer.
  const isMobileRef = useLatest(useMediaQuery("(max-width: 767px)"));
  // Rows without any focus content (e.g. Paradigm) never open a popup.
  const hasFocus = Boolean(focusDate || focusLocation || focusDesc || images.length);
  const [phase, setPhase] = React.useState<'initial' | 'growing' | 'dimming' | 'exiting'>('initial');
  const [exiting, setExiting] = React.useState(false);

  const hovered = hoveredItem === itemId;
  const active = hovered && !exiting;
  // A sibling row is the focused one — dim ourselves out of its way.
  const dimmedBySibling = focusedItem !== null && focusedItem !== itemId;
  // Growing and exiting are the slow, deliberate phases; everything else snaps.
  const slowPhase = phase === 'growing' || phase === 'exiting';
  const phaseDuration = slowPhase ? 'duration-1000' : 'duration-300';

  const handleMouseEnter = () => {
    // Rows without a Focus popup (e.g. Paradigm) have nothing to reveal, so skip
    // the growing/dimming "loading" phase and its wait cursor entirely.
    if (!hasFocus) return;
    setExiting(false);
    setHoveredItem(itemId);
    setPhase('growing');
  };

  const handleMouseLeave = () => {
    if (!hasFocus) return;
    setExiting(true);
    setHoveredItem(null);
    setPhase('exiting');
  };

  React.useEffect(() => {
    if (phase === 'growing' && active) {
      const delay = isMobileRef.current ? 0 : 1000;
      const dimmingTimer = setTimeout(() => {
        if (active) {
          setPhase('dimming');
        }
      }, delay);

      return () => clearTimeout(dimmingTimer);
    }
  }, [phase, active, isMobileRef]);

  // Publish this row as the page-wide focused item exactly while its Focus popup
  // is showing. Using a functional update keyed on itemId means a row handing off
  // to another can never clobber the newcomer's value, so the dim can't get stuck
  // or skipped the way the old cross-component DOM mutation did.
  React.useEffect(() => {
    if (phase === 'dimming' && active && hasFocus) {
      setFocusedItem(itemId);
      return () => setFocusedItem((prev) => (prev === itemId ? null : prev));
    }
    setFocusedItem((prev) => (prev === itemId ? null : prev));
  }, [phase, active, itemId, setFocusedItem, hasFocus]);

  // Handle exiting animation - smoothly transition back to initial after animations complete
  React.useEffect(() => {
    if (phase === 'exiting') {
      const exitTimer = setTimeout(() => {
        setPhase('initial');
        setExiting(false);
      }, 1000); // Match the longest animation duration (1s for growing)

      return () => clearTimeout(exitTimer);
    }
  }, [phase]);

  return (
    <div
      className={`col-span-2 grid grid-cols-subgrid items-center w-full tracking-tighter transition-all ${phaseDuration} ease-in-out`}
      data-work-id={itemId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        // Full opacity normally; dim out of the way when a sibling row is focused.
        opacity: dimmedBySibling ? 0.1 : 1,
        transition: slowPhase ? 'opacity 1s ease-in-out' : 'opacity 0.5s ease-in-out',
        position: 'relative',
        cursor: !hasFocus ? 'default' : phase === 'growing' ? 'wait' : 'pointer',
      }}
    >
      <div className="col-start-1 flex min-w-0 items-center gap-x-1 sm:gap-x-2">
        <div className="relative w-6 h-6 md:w-8 md:h-8 shrink-0">
          <Image
            src={img}
            alt={`Icon for company ${company}`}
            fill
            sizes="32px"
            className={`rounded-sm object-contain ${imgClassName}`}
          />
        </div>

        { /* Company goes here! */ }
        <span className={`font-plex text-lg md:text-xl shrink-0 mr-3 whitespace-nowrap transition-opacity ${phaseDuration} ease-in-out`} style={{
          opacity: 0.8,
        }}>{ company }</span>


        { /* Line component is here - don't change. */}
        <div className={`flex-grow h-px bg-[var(--text-color)] opacity-0 md:opacity-10 aria-hidden transition-opacity ${phaseDuration} ease-in-out`} />
      </div>

      { /* Overlay box. */}
        {hasFocus && (
          <Focus
            visible={phase === 'dimming'}
            date={focusDate}
            role={focusLocation}
            desc={focusDesc}
            images={images}
          />
        )}

      { /* Role goes here! */ }
      <span className={`col-start-2 font-plex text-lg md:text-xl whitespace-nowrap text-right transition-opacity underline md:no-underline decoration-[0.8px] underline-offset-[1px] ${phaseDuration} ease-in-out text-[var(--text-color)]`} style={{
        opacity: 0.8,
      }}>{ role }</span>
    </div>
  );
};

// note: i import experiences from presets/work.ts
const WorkSection = () => {
  return <div className="work-section-container grid grid-cols-[minmax(0,1fr)_max-content] gap-y-3 md:gap-x-[13px]">
    {experiences.map((i) => (
      <WorkRow key={i.key} company={i.company} role={i.role} img={i.img} imgClassName={i.imgClassName} focusDate={i.focusDate} focusDesc={i.focusDesc} focusLocation={i.focusLocation} images={i.images} />
    ))}
  </div>
}

export default WorkSection;
