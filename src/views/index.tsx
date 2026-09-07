import { useEffect, useState } from "react";
import { Shell } from "@/components/Layout";
import { Emboss } from "@/components/Emboss";
import { profile } from "@/presets/profile";
import { sections, type Section } from "@/presets/content";

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[13px] text-black">{children}</h2>
  );
}

function LeftPanel() {
  return <Emboss />;
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
    // display: contents lets the two spans sit in the grid columns directly;
    // opacity goes on the spans because a contents box does not paint.
    <li className="contents text-[13px] text-black">
      <span className={muted ? "opacity-40" : ""}>{name}</span>
      <span className={`tabular-nums ${muted ? "opacity-40" : ""}`}>{time}</span>
    </li>
  );
}

function RightPanel() {
  return (
    <ul className="grid w-fit grid-cols-[auto_auto] gap-x-16 gap-y-0">
      {profile.locations.map((place, i) => (
        <LocationRow key={place.name} name={place.name} timeZone={place.timeZone} muted={i !== 0} />
      ))}
    </ul>
  );
}

// Row under the glyph: name, then the short SHA of the deployed commit.
function Signature() {
  return (
    <p className="flex gap-3 text-[13px] text-black">
      <span>{profile.name}</span>
      <span className="tabular-nums opacity-40">{process.env.NEXT_PUBLIC_COMMIT_SHA}</span>
    </p>
  );
}

export default function IndexView() {
  return (
    <Shell
      left={<LeftPanel />}
      leftBelow={[<Signature key="signature" />, null]}
      middle={<MiddlePanel />}
      right={<RightPanel />}
    />
  );
}
