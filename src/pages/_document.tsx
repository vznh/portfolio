import { Html, Head, Main, NextScript } from "next/document";
import type { CSSProperties } from "react";
import { PAGE_BACKGROUND } from "@/presets/theme";

export default function Document() {
  return (
    <Html
      lang="en"
      prefix="og: https://ogp.me/ns#"
      style={{ "--page-background": PAGE_BACKGROUND } as CSSProperties}
    >
      <Head>
        <link
          rel="preload"
          href="/fonts/schengen-a-regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <div className="edge-top" aria-hidden="true" />
        <div className="edge-bottom" aria-hidden="true" />
        <NextScript />
      </body>
    </Html>
  );
}
