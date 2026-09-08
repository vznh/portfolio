import type { AppProps } from "next/app";
import "@/styles/globals.css";

if (process.env.NODE_ENV === "development") {
  void import("dialkit/styles.css");
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
