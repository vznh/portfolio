// presets/meta

import Head from "next/head"

const HeadPreset = () => {
  return <Head>
      <title>JASON SON</title>
      <meta name="description" content="Personal website of Jason Son." />
      <meta name="author" content="Jason Son" />
      <link rel="canonical" href="https://hobin.dev" />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content="Jason Son" />
      <meta property="og:description" content="Personal website of Jason Son." />
      <meta property="og:image" content="/images/cover.png" />
      <meta property="og:url" content="https://hobin.dev" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vivivinh" />
      <meta name="twitter:creator" content="@vivivinh" />
      <meta name="twitter:image" content="/images/cover.png" />

      {/* Theme Color */}
      <meta name="theme-color" content="#000000" />

      {/* Favicon */}
      <link rel="icon" href="/images/mole.png" />
      <link rel="apple-touch-icon" href="/images/mole.png" />
  </Head>
}

export default HeadPreset;
