// presets/meta

import Head from "next/head"

const SITE_URL = "https://www.hobin.dev"
const TITLE = "JASON SON"
const OG_TITLE = "Jason Son"
const DESCRIPTION = "Personal website of Jason Son."
const COVER_IMAGE = `${SITE_URL}/images/cover.png`

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Jason Son",
      url: `${SITE_URL}/`,
      description: DESCRIPTION,
    },
    {
      "@type": "Person",
      name: "Jason Son",
      url: `${SITE_URL}/`,
      image: COVER_IMAGE,
      description: DESCRIPTION,
      sameAs: [
        "https://x.com/jasonvinhson",
        "https://linkedin.com/in/vznh",
        "https://github.com/vznh",
        "https://venh.substack.com",
      ],
    },
  ],
}

const HeadPreset = () => {
  return <Head>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="author" content="Jason Son" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={`${SITE_URL}/`} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Jason Son" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={OG_TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={COVER_IMAGE} />
      <meta property="og:image:secure_url" content={COVER_IMAGE} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Jason Son portfolio cover" />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@jasonvinhson" />
      <meta name="twitter:creator" content="@jasonvinhson" />
      <meta name="twitter:title" content={OG_TITLE} />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={COVER_IMAGE} />
      <meta name="twitter:image:alt" content="Jason Son portfolio cover" />

      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />

      {/* Favicon */}
      <link rel="icon" href="/images/mole.png" />
      <link rel="apple-touch-icon" href="/images/mole.png" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
  </Head>
}

export default HeadPreset;
