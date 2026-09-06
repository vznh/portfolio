import { useEffect, useState } from "react";
import Image from "next/image";
import { Shell } from "@/components/Layout";
import { profile } from "@/presets/profile";
import { socials, type SocialLink } from "@/presets/socials";
import { sections, type Section } from "@/presets/content";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-[13px] text-black">{children}</h2>
  );
}

function SocialRow({ link }: { link: SocialLink }) {
  return (
    <li>
      <a
        href={link.href}
        {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="font-mono text-[11px] text-black no-underline transition-opacity hover:opacity-60 hover:underline"
      >
        {link.label}
      </a>
    </li>
  );
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="font-mono text-[11px] text-gray-400">
      Brooklyn {time ?? "--:--:--"}
    </p>
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

function Nav() {
  return (
    <nav className="mt-6 flex flex-col gap-1">
      {[
        ...sections.map((s) => ({ id: s.id, label: s.heading })),
        { id: "contact", label: "Contact" },
      ].map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(link.id);
          }}
          className="font-mono text-[11px] uppercase tracking-wide text-gray-400 no-underline transition-colors hover:text-black hover:underline"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

function RightPanel() {
  return (
    <div>
      <h1 className="font-heading text-[13px] text-black">{profile.name}</h1>
      <p className="mt-3 text-[13px] leading-relaxed text-gray-500">{profile.intro}</p>
      <p className="mt-1 text-[13px] text-gray-500">{profile.location}</p>

      <Nav />

      <div id="contact" className="mt-8">
        <PanelLabel>Contact</PanelLabel>
        <ul className="mt-3 flex flex-col gap-1">
          {socials.map((link) => (
            <SocialRow key={link.href} link={link} />
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <LocalTime />
      </div>
    </div>
  );
}

export default function IndexView() {
  return (
    <Shell left={<LeftPanel />} middle={<MiddlePanel />} right={<RightPanel />} />
  );
}
