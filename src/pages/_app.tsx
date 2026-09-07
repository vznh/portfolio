import type { AppProps } from "next/app";
import "@/styles/globals.css";

// Dev-only DialKit toolbar. The guards keep dialkit out of production
// bundles: webpack folds NODE_ENV at build time and prunes the dead branch.
if (process.env.NODE_ENV === "development") {
  require("dialkit/styles.css");
}

export default function App({ Component, pageProps }: AppProps) {
  // DialRoot itself is rendered inside EmbossDial so it shares the same
  // dialkit module instance; here we only load its global stylesheet.
  return <Component {...pageProps} />;
}
