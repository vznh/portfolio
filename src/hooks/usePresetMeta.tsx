// hooks/usePresetMeta.tsx
import Head from 'next/head';

export function UsePresetMeta() {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://www.hobin.dev';

  return (
    <Head>
      <title>JASON SON</title>
      <meta name="description" content="Engineering pursuing alignment." />
      <meta name="keywords" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content="Jason Son" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="JASON SON" />
      <meta property="og:description" content="Engineer pursuing alignment." />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={`${siteUrl}/images/cover.png`} />
      <link rel="icon" href="/favicon.ico" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Jason Son - Person" />
      <meta name="twitter:description" content="Engineer pursuing alignment." />
      <meta name="twitter:image" content={`${siteUrl}/images/cover.png`} />
    </Head>
  );
}
