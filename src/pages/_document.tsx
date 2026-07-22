import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        {/* Favicons & App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico?v=2" type="image/x-icon" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="application-name" content="ToolBasketAI" />
        <meta name="apple-mobile-web-app-title" content="ToolBasketAI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Performance: Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Global site verification (add your actual codes here) */}
        <meta name="google-site-verification" content="iNd_jJnkjOmSB-Al-BEjoMnfRz4q_Zsp7zr5HVSmAeM" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4813321349853858"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
