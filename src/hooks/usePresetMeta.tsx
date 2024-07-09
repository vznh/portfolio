// hooks/usePresetMeta.tsx
import Head from 'next/head';

const PresetMeta = (
  title: string,
  keywords: string,
  description: string, 
  ogTitle: string,
  ogType: string,
  ogUrl: string,
  ogImg: string
) => {
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <meta name="keywords" content={keywords}></meta>
      <meta name="description" content={description}></meta>
      <meta property="og:title" content={ogTitle} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImg} />
      <meta charSet="utf-8"></meta>
      <link rel="icon" href="/favicon.ico"></link>
      <title>{title}</title>
    </Head>
  );
};

PresetMeta.defaultProps = {
  title: "Jason Son - Personal",
  keywords:
    "jason son, handsome korean viet coder, handsome, goated, polyglot",
  description:
    "This website is a brief introduction to myself.",
  ogTitle: "Jason Son - Person",
  ogUrl: "https://smlweb-src.s3.ap-northeast-2.amazonaws.com/handz_thumb.jpg",
  ogType: "website",
};

export default PresetMeta;