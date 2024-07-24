import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ContentContainer } from "@/components/templates/ContentContainer";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContentContainer>
      <Component {...pageProps} />
      <Analytics />
    </ContentContainer>
  );
}