import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import SplashCursor from "@/components/SplashCursor";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  const initGuestId = useAuthStore((state) => state.initGuestId);

  useEffect(() => {
    initGuestId();
  }, [initGuestId]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <SplashCursor />
      <Component {...pageProps} />
    </>
  );
}
