import { useEffect, useState } from "react";
import { profile } from "@/presets/profile";

const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string) {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const formatter = formatterFor(timeZone);
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
    <li className="contents text-[13px] text-black">
      <span className={muted ? "opacity-[0.55]" : ""}>{name}</span>
      <span className={`tabular-nums ${muted ? "opacity-[0.55]" : ""}`}>{time}</span>
    </li>
  );
}

export function LocationsCell() {
  return (
    <ul className="grid w-fit grid-cols-[auto_auto] gap-x-16 gap-y-0">
      {profile.locations.map((place, i) => (
        <LocationRow key={place.name} name={place.name} timeZone={place.timeZone} muted={i !== 0} />
      ))}
    </ul>
  );
}
