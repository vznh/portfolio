import Head from "next/head";
import { profile } from "@/presets/profile";

export const SITE_URL = "https://www.hobin.dev";
const NAME = profile.name;
const TITLE = NAME;
const DESCRIPTION =
  "Jason Son does engineering, research, and design in New York.";
const OG_IMAGE = `${SITE_URL}/og.png`;
const OG_IMAGE_ALT = "Klein-blue background for Jason Son’s portfolio.";
const THEME_COLOR = "#002FA7";
const TWITTER = "@jasonvinhson";
const CANONICAL_URL = `${SITE_URL}/`;
const PERSON_ID = `${SITE_URL}/#person`;
const PROFILES = [
  "https://jasonvinhson.com",
  "https://x.com/jasonvinhson",
  "https://linkedin.com/in/vznh",
  "https://github.com/vznh",
  "https://venh.substack.com",
];

const openGraph = {
  "og:type": "website",
  "og:site_name": NAME,
  "og:locale": "en_US",
  "og:title": TITLE,
  "og:description": DESCRIPTION,
  "og:url": CANONICAL_URL,
  "og:image": OG_IMAGE,
  "og:image:secure_url": OG_IMAGE,
  "og:image:type": "image/png",
  "og:image:width": "1200",
  "og:image:height": "630",
  "og:image:alt": OG_IMAGE_ALT,
};

const twitterCard = {
  "twitter:card": "summary_large_image",
  "twitter:site": TWITTER,
  "twitter:creator": TWITTER,
  "twitter:title": TITLE,
  "twitter:description": DESCRIPTION,
  "twitter:image": OG_IMAGE,
  "twitter:image:alt": OG_IMAGE_ALT,
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: NAME,
      url: CANONICAL_URL,
      description: DESCRIPTION,
      inLanguage: "en-US",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: CANONICAL_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": PERSON_ID },
      mainEntity: { "@id": PERSON_ID },
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      image: { "@id": `${SITE_URL}/#share-image` },
    },
    {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#share-image`,
      url: OG_IMAGE,
      contentUrl: OG_IMAGE,
      description: OG_IMAGE_ALT,
      encodingFormat: "image/png",
      width: 1200,
      height: 630,
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: NAME,
      url: CANONICAL_URL,
      description: "Engineer and designer in New York.",
      mainEntityOfPage: { "@id": `${SITE_URL}/#webpage` },
      jobTitle: "Engineer and designer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "New York",
        addressRegion: "NY",
        addressCountry: "US",
      },
      sameAs: PROFILES,
    },
  ],
};

export function Meta() {
  return (
    <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} key="description" />
      <meta name="author" content={NAME} key="author" />
      <meta name="application-name" content={NAME} key="application-name" />
      <meta name="robots" content="index, follow, max-image-preview:large" key="robots" />
      <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
      <link rel="canonical" href={CANONICAL_URL} key="canonical" />
      <link rel="author" href={`${SITE_URL}/#content`} key="author-link" />
      {PROFILES.map((url) => (
        <link rel="me" href={url} key={`profile:${url}`} />
      ))}

      {Object.entries(openGraph).map(([property, content]) => (
        <meta property={property} content={content} key={property} />
      ))}
      {Object.entries(twitterCard).map(([name, content]) => (
        <meta name={name} content={content} key={name} />
      ))}

      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content={THEME_COLOR} key="theme-color" />

      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </Head>
  );
}
