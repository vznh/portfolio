import Head from "next/head";

// Canonical host. hobin.dev and jasonvinhson.com should 301 here at the DNS/host level.
export const SITE_URL = "https://www.hobin.dev";
const NAME = "Jason Son";
const TITLE = "Jason Son";
const DESCRIPTION = "Engineer and designer in New York.";
const OG_IMAGE = `${SITE_URL}/og.png`;
const THEME_COLOR = "#002FA7";
const TWITTER = "@jasonvinhson";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: NAME,
      url: `${SITE_URL}/`,
      description: DESCRIPTION,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: NAME,
      url: `${SITE_URL}/`,
      image: OG_IMAGE,
      description: DESCRIPTION,
      jobTitle: "Engineer and designer",
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
      sameAs: [
        "https://jasonvinhson.com",
        "https://x.com/jasonvinhson",
        "https://linkedin.com/in/vznh",
        "https://github.com/vznh",
        "https://venh.substack.com",
      ],
    },
  ],
};

export function Meta() {
  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="author" content={NAME} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={`${SITE_URL}/`} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER} />
      <meta name="twitter:creator" content={TWITTER} />
      <meta name="twitter:title" content={TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content={NAME} />

      {/* Icons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content={THEME_COLOR} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
