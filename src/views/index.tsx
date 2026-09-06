import { useEffect, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/Layout";
import { profile } from "@/presets/profile";
import { sections, type Section } from "@/presets/content";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[13px] text-black">{children}</h2>
  );
}

function LeftPanel() {
  const image = profile.image;
  if (!image) {
    // Placeholder until an image is dropped into /public/images and set in presets/profile.ts
    return <div className="aspect-[4/5] w-full max-w-[280px] bg-gray-100" aria-hidden />;
  }
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      priority
      className="w-full max-w-[280px] h-auto"
    />
  );
}

function Prose({ section }: { section: Section }) {
  // `special` sections will get their own color + scroll target later; same look for now.
  return (
    <section id={section.id} className="mb-10 last:mb-0">
      <PanelLabel>{section.heading}</PanelLabel>
      <div className="mt-3 flex flex-col gap-3">
        {section.body.map((paragraph, i) => (
          <p key={i} className="max-w-[52ch] text-[13px] leading-relaxed text-black">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

function MiddlePanel() {
  return (
    <div>
      {sections.map((section) => (
        <Prose key={section.id} section={section} />
      ))}
    </div>
  );
}

// Live HH:MM:SS clock for one time zone. Renders a placeholder until mounted
// so the server and client markup match.
function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);
  return time ?? "--:--:--";
}

function LocationRow({ name, timeZone, muted }: { name: string; timeZone: string; muted: boolean }) {
  const time = useClock(timeZone);
  return (
    <li className={`flex justify-between gap-6 text-[13px] text-black ${muted ? "opacity-40" : ""}`}>
      <span>{name}</span>
      <span className="tabular-nums">{time}</span>
    </li>
  );
}

function RightPanel() {
  return (
    <ul className="flex max-w-[280px] flex-col">
      {profile.locations.map((place, i) => (
        <LocationRow key={place.name} name={place.name} timeZone={place.timeZone} muted={i !== 0} />
      ))}
    </ul>
  );
}

export default function IndexView() {
  return (
    <Shell left={<LeftPanel />} middle={<MiddlePanel />} right={<RightPanel />} />
  );
}
