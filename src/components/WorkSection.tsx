"use client";
// components/WorkSection
import React from "react";
import { experiences } from "@/presets/work";
import Image from "next/image";
import { useHoverContext } from "@/hooks/useHoverContext";
import { useId } from "react";

export interface WorkRowProps {
  key: number;
  company: string;
  date?: string;
  role: string;
  img: string;
  className?: string;
}

const WorkRow: React.FC<WorkRowProps> = ({
  company,
  date = "",
  role,
  img,
  className = ""
}) => {
  const { hoveredItem, setHoveredItem } = useHoverContext();
  const itemId = useId();
  const [animationPhase, setAnimationPhase] = React.useState<'initial' | 'growing' | 'dimming'>('initial');

  const isHovered = hoveredItem === itemId;

  const handleMouseEnter = () => {
    setHoveredItem(itemId);
    setAnimationPhase('growing');
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setAnimationPhase('initial');
  };

  // Handle the two-phase animation sequence
  React.useEffect(() => {
    if (animationPhase === 'growing' && isHovered) {
      // After 1 second of growing, start dimming other elements
      const dimmingTimer = setTimeout(() => {
        setAnimationPhase('dimming');
      }, 1000);

      return () => clearTimeout(dimmingTimer);
    }
  }, [animationPhase, isHovered]);

  // Apply selective dimming when in dimming phase
  React.useEffect(() => {
    const animationDuration = '0.5s ease-in-out';

    if (animationPhase === 'dimming' && isHovered) {
      // Dim the header section (contains name, description, and links)
      const headerSection = document.querySelector('.main-content > div:first-child');
      if (headerSection) {
        (headerSection as HTMLElement).style.transition = `opacity ${animationDuration}`;
        (headerSection as HTMLElement).style.opacity = '0.1';
      }

      // Dim other project sections (but not work section)
      const projectSections = document.querySelectorAll('[data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"]');
      projectSections.forEach((section) => {
        (section as HTMLElement).style.transition = `opacity ${animationDuration}`;
        (section as HTMLElement).style.opacity = '0.1';
      });

      // Dim the footer section (contains contact info and logo)
      const footerSections = document.querySelectorAll('[data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      footerSections.forEach((section) => {
        if (!section.hasAttribute('data-section') || section.getAttribute('data-section') !== 'work') {
          (section as HTMLElement).style.transition = `opacity ${animationDuration}`;
          (section as HTMLElement).style.opacity = '0.1';
        }
      });

      // Dim other work rows within the same section
      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          const rowElement = row as HTMLElement;
          // Check if this is not the currently hovered row
          if (rowElement.getAttribute('data-work-id') !== itemId) {
            rowElement.style.transition = `opacity ${animationDuration}`;
            rowElement.style.opacity = '0.1';
          }
        });
      }
    } else if (animationPhase === 'initial' || !isHovered) {
      // Reset opacity for all dimmed elements with smooth transition
      const elementsToReset = document.querySelectorAll('.main-content > div:first-child, [data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      elementsToReset.forEach((element) => {
        (element as HTMLElement).style.transition = `opacity ${animationDuration}`;
        (element as HTMLElement).style.opacity = '';
      });

      // Reset opacity for all work rows
      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          const rowElement = row as HTMLElement;
          rowElement.style.transition = `opacity ${animationDuration}`;
          rowElement.style.opacity = '';
        });
      }
    }

    // Cleanup function to reset on unmount
    return () => {
      const elementsToReset = document.querySelectorAll('.main-content > div:first-child, [data-section="projects"], [data-section="upcoming"], [data-section="open-source"], [data-section="other"], .relative.flex.flex-col.md\\:flex-row.justify-between');
      elementsToReset.forEach((element) => {
        (element as HTMLElement).style.opacity = '';
        (element as HTMLElement).style.transition = '';
      });

      const workSection = document.querySelector('.work-section-container');
      if (workSection) {
        const allWorkRows = workSection.querySelectorAll('.work-section-container > .flex.items-center');
        allWorkRows.forEach((row) => {
          (row as HTMLElement).style.opacity = '';
          (row as HTMLElement).style.transition = '';
        });
      }
    };
  }, [animationPhase, isHovered, itemId]);

  return (
    <div
      className={`flex items-center w-full tracking-tighter gap-x-1 sm:gap-x-2 transition-all ${animationPhase === 'growing' ? 'duration-1000' : 'duration-300'} ease-in-out ${className}`}
      data-work-id={itemId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: 1, // Always full opacity for work items (they handle their own internal opacity)
        transition: animationPhase === 'growing' ? 'transform 1s ease-in-out' : 'all 0.4s ease-in-out',
        position: 'relative',
        zIndex: isHovered ? 20 : 'auto',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        cursor: animationPhase === 'growing' ? 'wait' : 'pointer',
      }}
    >
      <Image
        src={img}
        alt={`Icon for company ${company}`}
        width={24}
        height={24}
        className="rounded-md border border-opacity-5 border-black w-6 h-6 md:w-8 md:h-8"
      />

      { /* Company goes here! */ }
      <span className={`font-geist text-lg md:text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap transition-opacity ${animationPhase === 'growing' ? 'duration-1000' : 'duration-300'} ease-in-out`} style={{
        opacity: 0.8,
      }}>{ company }</span>

      { /* Date goes here! */ }
      <span className={`font-geist text-lg md:text-xl text-white min-w-0 overflow-hidden whitespace-nowrap transition-opacity ${animationPhase === 'growing' ? 'duration-1000' : 'duration-300'} ease-in-out`} style={{
        opacity: 0.4,
      }}>{ date }</span>

      { /* Line component is here - don't change. */}
      <div className={`flex-grow h-px bg-white opacity-0 md:opacity-20 aria-hidden transition-opacity ${animationPhase === 'growing' ? 'duration-1000' : 'duration-300'} ease-in-out`} />

      { /* Role goes here! */ }
      <span className={`font-geist text-lg md:text-xl min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right transition-opacity ${animationPhase === 'growing' ? 'duration-1000' : 'duration-300'} ease-in-out`} style={{
        opacity: 0.8,
      }}>{ role }</span>
    </div>
  );
};

// note: i import experiences from presets/work.ts
const WorkSection = () => {
  return <div className="work-section-container flex flex-col gap-y-3">
    {experiences.map((i) => (
      <WorkRow key={i.key} company={i.company} date={i.date} role={i.role} img={i.img} />
    ))}
  </div>
}

export default WorkSection;
