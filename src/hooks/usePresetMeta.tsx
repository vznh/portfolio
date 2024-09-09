// hooks/usePresetMeta.tsx
import Head from 'next/head';

export function UsePresetMeta() {
  return (
    <Head>
      <title>Jason Son - Personal</title>
      <meta name="description" content="Programmer, and occasional chiller." />
      <meta name="keywords" content="polyglot, ceo, student, biology and cs at ucsc" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Jason Son" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Programmer, serial chiller." />
      <meta property="og:url" content="https://www.hobin.dev" />
      <meta property="og:image" content="/images/cover-image.png" />
      <link rel="icon" href="/images/favicon.ico" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Jason Son - Person" />
      <meta name="twitter:description" content="Programmer, serial chiller." />
      <meta name="twitter:image" content="/images/cover-image.png" />
    </Head>
  );
}
