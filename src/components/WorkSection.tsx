"use client";
// components/WorkSection
import React from "react";
import { experiences } from "@/presets/work";
import Image from "next/image";
import { useHoverContext } from "@/hooks/useHoverContext";
import { useId } from "react";
import Focus from "./Focus";

export interface WorkRowProps {
  key: number;
  company: string;
  date?: string;
  role: string;
  img: string;
  className?: string;

  focusDate?: string;
  focusRole?: string;
  focusDesc?: string;
  images?: string[];
}

const WorkRow: React.FC<WorkRowProps> = ({
  company,
  date = "",
  role,
  img,
  className = "",
  focusDate = "",
  focusRole = "",
  focusDesc = "",
  images = []
}) => {
  const { hoveredItem, setHoveredItem } = useHoverContext();
  const itemId = useId();
  const [phase, setPhase] = React.useState<'initial' | 'growing' | 'dimming' | 'exiting'>('initial');
  const [exiting, setExiting] = React.useState(false);

  const hovered = hoveredItem === itemId;
  const active = hovered && !exiting;

  const handleMouseEnter = () => {
    setExiting(false);
    setHoveredItem(itemId);
    setPhase('growing');
  };

  const handleMouseLeave = () => {
    setExiting(true);
    setHoveredItem(null);
    setPhase('exiting');
  };

  React.useEffect(() => {
    if (phase === 'growing' && active) {
      // After 1 second of growing, start dimming other elements
      const dimmingTimer = setTimeout(() => {
        if (active) { // Double-check we're still hovered before transitioning
          setPhase('dimming');
        }
      }, 1000);

      return () => clearTimeout(dimmingTimer);
    }
  }, [phase, active]);

  React.useEffect(() => {
    const duration = '0.5s ease-in-out';

    if (phase === 'dimming' && active) {
      const headerSection = document.querySelector('.main-content > div:first-child');
      if (headerSection) {
        (headerSection as HTMLElement).style.transition = `opacity ${duration}`;
        (headerSection as HTMLElement).style.opacity = '0.1';
      }

      const projectSections = document.querySelectorAll('[data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"]');
      projectSections.forEach((section) => {
        (section as HTMLElement).style.transition = `opacity ${duration}`;
        (section as HTMLElement).style.opacity = '0.1';
      });

      const footerSections = document.querySelectorAll('[data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      footerSections.forEach((section) => {
        if (!section.hasAttribute('data-section') || section.getAttribute('data-section') !== 'work') {
          (section as HTMLElement).style.transition = `opacity ${duration}`;
          (section as HTMLElement).style.opacity = '0.1';
        }
      });

      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        // Dim the headers (PREVIOUSLY and TYPE)
        const headerDiv = workSection.querySelector('.flex.flex-row.justify-between');
        if (headerDiv) {
          (headerDiv as HTMLElement).style.transition = `opacity ${duration}`;
          (headerDiv as HTMLElement).style.opacity = '0.1';
        }

        // Dim other work rows
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          const rowElement = row as HTMLElement;
          if (rowElement.getAttribute('data-work-id') !== itemId) {
            rowElement.style.transition = `opacity ${duration}`;
            rowElement.style.opacity = '0.1';
          }
        });
      }
    } else if (phase === 'initial' || phase === 'exiting' || !active) {
      const elementsToReset = document.querySelectorAll('.main-content > div:first-child, [data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      elementsToReset.forEach((element) => {
        (element as HTMLElement).style.transition = `opacity ${duration}`;
        (element as HTMLElement).style.opacity = '';
      });

      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        // Reset the headers (PREVIOUSLY and TYPE)
        const headerDiv = workSection.querySelector('.flex.flex-row.justify-between');
        if (headerDiv) {
          (headerDiv as HTMLElement).style.transition = `opacity ${duration}`;
          (headerDiv as HTMLElement).style.opacity = '';
        }

        // Reset other work rows
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          const rowElement = row as HTMLElement;
          rowElement.style.transition = `opacity ${duration}`;
          rowElement.style.opacity = '';
        });
      }
    }

    return () => {
      const elementsToReset = document.querySelectorAll('.main-content > div:first-child, [data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      elementsToReset.forEach((element) => {
        (element as HTMLElement).style.opacity = '';
        (element as HTMLElement).style.transition = '';
      });

      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        // Reset the headers (PREVIOUSLY and TYPE)
        const headerDiv = workSection.querySelector('.flex.flex-row.justify-between');
        if (headerDiv) {
          (headerDiv as HTMLElement).style.opacity = '';
          (headerDiv as HTMLElement).style.transition = '';
        }

        // Reset other work rows
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          (row as HTMLElement).style.opacity = '';
          (row as HTMLElement).style.transition = '';
        });
      }
    };
  }, [phase, active, itemId]);

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
      className={`flex items-center w-full tracking-tighter gap-x-1 sm:gap-x-2 transition-all ${(phase === 'growing' || phase === 'exiting') ? 'duration-1000' : 'duration-300'} ease-in-out ${className}`}
      data-work-id={itemId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: 1, // Always full opacity for work items (they handle their own internal opacity)
        transition: (phase === 'growing' || phase === 'exiting') ? 'opacity 1s ease-in-out' : 'opacity 0.3s ease-in-out',
        position: 'relative',
        cursor: phase === 'growing' ? 'wait' : 'pointer',
      }}
    >
      <Image
        src={img}
        alt={`Icon for company ${company}`}
        width={24}
        height={24}
        className="rounded-sm w-6 h-6 md:w-8 md:h-8"
      />

      { /* Company goes here! */ }
      <span className={`font-plex text-lg md:text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity ${(phase === 'growing' || phase === 'exiting') ? 'duration-1000' : 'duration-300'} ease-in-out`} style={{
        opacity: 0.8,
      }}>{ company }</span>


      { /* Line component is here - don't change. */}
      <div className={`flex-grow h-px bg-[#1E1919] opacity-0 md:opacity-10 aria-hidden transition-opacity ${(phase === 'growing' || phase === 'exiting') ? 'duration-1000' : 'duration-300'} ease-in-out`} />

      { /* Overlay box positioned over the line */}
        <Focus
          visible={phase === 'dimming'}
          date={focusDate}
          role={focusRole || role}
          desc={focusDesc}
          images={images}
        />

      { /* Role goes here! */ }
      <span className={`font-plex text-lg md:text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right transition-opacity ${(phase === 'growing' || phase === 'exiting') ? 'duration-1000' : 'duration-300'} ease-in-out text-[#1E1919]`} style={{
        opacity: 0.8,
      }}>{ role }</span>
    </div>
  );
};

// note: i import experiences from presets/work.ts
const WorkSection = () => {
  return <div className="work-section-container flex flex-col gap-y-3">
    {experiences.map((i) => (
      <WorkRow key={i.key} company={i.company} date={i.date} role={i.role} img={i.img} focusDate={i.focusDate} focusDesc={i.focusDesc} focusRole={i.focusRole} images={i.images} />
    ))}
  </div>
}

export default WorkSection;
