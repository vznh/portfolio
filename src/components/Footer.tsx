// components/Footer
import Crypted from "@/components/Crypted";
import { m } from "framer-motion";
import Link from "next/link";
import React from "react";

interface FooterProps {
  footerRef: React.RefObject<HTMLDivElement>;
  // Resolved target opacity for the whole footer (dim/reveal handled by parent).
  opacity: number;
  dimAnimating: boolean;
  showCrypted: boolean;
  version: string;
}

const VersionLink = ({ showCrypted, version, rotateOnHover }: { showCrypted: boolean; version: string; rotateOnHover: boolean }) => (
  <m.div
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
    <span className={`text-[var(--text-color)] text-[11px] inline-block transition-transform duration-300 ease-out ${rotateOnHover ? "group-hover:-rotate-45" : "-rotate-45"}`}>→</span>
  </m.div>
);

const Footer: React.FC<FooterProps> = ({
  footerRef,
  opacity,
  dimAnimating,
  showCrypted,
  version,
}) => {
  return (
    <m.footer
      ref={footerRef}
      className="relative flex w-full justify-center h-[200px] md:h-[500px] md:mb-[-350px]"
      initial={{ opacity: 0.05 }}
      animate={{ opacity }}
      transition={{ duration: dimAnimating ? 0.5 : 1.0, ease: "easeInOut" }}
    >
      <div className="absolute top-20 right-0 hidden md:flex flex-col gap-y-2">
        <VersionLink showCrypted={showCrypted} version={version} rotateOnHover />
      </div>

      <div className="absolute top-24 md:hidden left-0 flex flex-col gap-y-2">
        <VersionLink showCrypted={showCrypted} version={version} rotateOnHover={false} />
      </div>
    </m.footer>
  );
};

export default Footer;
