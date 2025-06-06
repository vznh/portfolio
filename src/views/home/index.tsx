// views/home/index.tsx
import { useEffect, useState } from "react";
import { cn } from "@/utils";
import Link from "next/link";

export const HomeView = () => {
  const [opacity, setOpacity] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(100);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col",
        "h-full w-full",
        "transition-all duration-1000 ease-in-out",
      )}
      style={{ opacity: `${opacity}%` }}
    >
      <h1>
        <b>Jason Son</b>
      </h1>

      <span className="text-lg opacity-80">
        The devil is in the details. But so is salvation.
      </span>
      <br />
      <span className="text-lg opacity-80">
        I&apos;m an engineer that leverages design to bring ideas to
        collective alignment.
      </span>
      <br />
      <span className="text-lg opacity-80">
        Previously a founder <b>@Stanford</b> doing EdTech, and {' '}
        <b>@Apple</b> for designing and constructing system utility tools. Since then,
        I&apos;ve been pursuing play with pixels, exploring quantitative methods
        for trading, and experimenting at hackathons.
      </span>
      <br />
      <span className="text-sm opacity-50">
        Try my new experiments <Link href="https://tally.so/r/wgxdK1" target="_blank" className="underline underline-offset-4">if you&apos;d like.</Link>
      </span>

      <br />
      <h1>
        <b>Other and only related</b>
      </h1>

      <div className="flex space-x-4 opacity-80">
        <Link
          href="https://x.com/@vivivinh"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          X/Twitter
        </Link>
        <Link
          href="https://www.linkedin.com/in/vznh"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          LinkedIn
        </Link>
        <Link
          href="https://www.github.com/vznh"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all duration-1000 hover:underline"
        >
          GitHub
        </Link>
        <Link
          href="https://substack.com/@venh?"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Substack
        </Link>
        <Link
          href="https://drive.google.com/file/d/1YmFJaPbVZI3VblrHa6-jzCFFdrUoMqWi/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Resume
        </Link>
      </div>
    </div>
  );
};
