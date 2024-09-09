// hooks/usePresetMeta.tsx
import Head from 'next/head';

export function UsePresetMeta() {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://www.hobin.dev';

  return (
    <Head>
      <title>Jason Son - Personal</title>
      <meta name="description" content="Programmer, and occasional chiller." />
      <meta name="keywords" content="polyglot, ceo, student, biology and cs at ucsc" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Jason Son" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Jason Son - Personal" />
      <meta property="og:description" content="Programmer, serial chiller." />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${siteUrl}/images/cover-image.png`} />
      <link rel="icon" href="/images/favicon.ico" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Jason Son - Person" />
      <meta name="twitter:description" content="Programmer, serial chiller." />
      <meta name="twitter:image" content={`${siteUrl}/images/cover-image.png`} />
    </Head>
  );
}
