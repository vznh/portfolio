import type { AppProps } from "next/app";
import "@/styles/globals.css";

// Dev-only DialKit toolbar. The guards keep dialkit out of production
// bundles: webpack folds NODE_ENV at build time and prunes the dead branch.
if (process.env.NODE_ENV === "development") {
  require("dialkit/styles.css");
}

export default function App({ Component, pageProps }: AppProps) {
  if (process.env.NODE_ENV === "development") {
    const { DialRoot } = require("dialkit") as typeof import("dialkit");
    return (
      <>
        <Component {...pageProps} />
        <DialRoot position="bottom-right" />
      </>
    );
  }
  return <Component {...pageProps} />;
}
