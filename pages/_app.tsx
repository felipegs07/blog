import React from 'react';
import Head from 'next/head';
import { Footer } from '../components/Footer';
import { globals } from '../globals';
import { Header } from '../components/Header';
import '../styles/base.css';

const App: React.FC = ({ Component, pageProps }: any) => {
  return (
    <div className="container">
      <Head>
        <html lang="en-US" />
        {globals.googleAnalyticsId && (
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${globals.googleAnalyticsId}`}></script>
        )}
        {globals.googleAnalyticsId && (
          <script dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('globals', '${globals.googleAnalyticsId}');
            `,
          }}></script>
        )}
         <meta name="description" content={globals.siteDescription}></meta>
         <meta name="author" content={globals.yourName}></meta>
         <meta name="keywords" content={globals.keyWords}></meta>
      </Head>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
};

export default App;
