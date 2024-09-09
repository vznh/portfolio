import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ContentContainer } from "@/components/templates/ContentContainer";
import { Analytics } from "@vercel/analytics/react";
import { UsePresetMeta } from "@/hooks/usePresetMeta";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContentContainer>
      <UsePresetMeta />
      <Component {...pageProps} />
      <Analytics />
    </ContentContainer>
  );
}
