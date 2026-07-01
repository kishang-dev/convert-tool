import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import SplashCursor from "@/components/SplashCursor";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { useRouter } from "next/router";
import * as gtag from "@/lib/gtag";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function App({ Component, pageProps }: AppProps) {
  const initGuestId = useAuthStore((state) => state.initGuestId);
  const router = useRouter();

  useEffect(() => {
    initGuestId();
  }, [initGuestId]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <SplashCursor />
        <Component {...pageProps} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
