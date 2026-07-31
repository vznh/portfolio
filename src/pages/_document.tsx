import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Body face. Preloaded so `font-display: block` resolves before
            first paint instead of flashing the text into place later. */}
        <link
          rel="preload"
          href="/fonts/Plex.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
