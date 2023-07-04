import "../styles/globals.css";
import "fontsource-poppins"
import PageWithLayoutType from '../types/pageWithLayoutType'
import Head from "next/head";
import React from 'react'

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function Verticlip({ Component, pageProps }: AppLayoutProps) {
  return (
    <>
      <Head {...pageProps}>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <title>Verticlip by Pipeline</title>

          <meta name="twitter:card" content="summary" key="twcard" />
          <meta name="twitter:creator" content={"@pipelinegg"} key="twhandle" />

          <meta property="og:url" content={"https://www.verticlip.gg"} key="ogurl" />
          <meta property="og:image" content={"https://cdn.pipeline.gg/verticlipthumb_6e5ef6391a.png"} key="ogimage" />
          <meta property="og:site_name" content={"Verticlip"} key="ogsitename" />
          <meta property="og:title" content={"Verticlip | Turn Your Clips Into Viral Growth"} key="ogtitle" />
          <meta property="og:description" content={"Take your stream clips into vertical videos ready for TikTok, YouTube and Instagram in under 30 seconds"} key="ogdesc" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default Verticlip;
