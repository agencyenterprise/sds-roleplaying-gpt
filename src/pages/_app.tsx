import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/agencyenterprise/sds-utils@latest/dist/packages/badge/src/lib/badge.css"
        />

        <link rel="icon" type="image/png" href="/logo.png" />

        <title>Roleplaying GPT</title>
        <meta name="title" content="Roleplaying GPT" />
        <meta name="description" content="Roleplaying GPT" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://roleplayinggpt.com/" />
        <meta property="og:title" content="Roleplaying GPT" />
        <meta property="og:description" content="Roleplaying GPT" />
        <meta
          property="og:image"
          content="https://roleplayinggpt.com/og.jpg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://roleplayinggpt.com/" />
        <meta property="twitter:title" content="Roleplaying GPT" />
        <meta property="twitter:description" content="Roleplaying GPT" />
        <meta
          property="twitter:image"
          content="https://roleplayinggpt.com/og.jpg"
        ></meta>
      </Head>
      <Component {...pageProps} />
      <Script
        id="badge"
        src="https://cdn.jsdelivr.net/gh/agencyenterprise/sds-utils@latest/dist/packages/badge/src/lib/badge.js"
        onLoad={() => {
          (window as any).SDSUtilsBadge({
            expandable: true,
            location: "bottomright",
            position: "fixed",
          });
        }}
      ></Script>
    </>
  );
}
