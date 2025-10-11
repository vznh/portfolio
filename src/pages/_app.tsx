import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";
import HeadPreset from "@/presets/meta";
import { Fragment } from "react";
import { HoverProvider } from "@/hooks/useHoverContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <HeadPreset />
      <Analytics />
      <HoverProvider>
        <Component {...pageProps} />
      </HoverProvider>
    </Fragment>
  );
}
