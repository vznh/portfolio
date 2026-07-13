// components/Footer
import Crypted from "@/components/Crypted";
import { EyeIcon, MailIcon } from "@/presets/svgs";
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
  mailHovered: boolean;
  setMailHovered: (v: boolean) => void;
  eyeHovered: boolean;
  setEyeHovered: (v: boolean) => void;
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
  mailHovered,
  setMailHovered,
  eyeHovered,
  setEyeHovered,
}) => {
  return (
    <m.footer
      ref={footerRef}
      className="relative flex w-full justify-center h-[200px] md:h-[500px] md:mb-[-350px]"
      initial={{ opacity: 0.05 }}
      animate={{ opacity }}
      transition={{ duration: dimAnimating ? 0.5 : 1.0, ease: "easeInOut" }}
    >
      <div className="absolute top-4 md:top-20 left-0 flex flex-col gap-y-2">
        <m.div
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
            <m.span
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
        </m.div>

        <m.div
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
            <m.span
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
        </m.div>
      </div>

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
