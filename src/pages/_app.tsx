import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function App({ Component, pageProps }: AppProps) {
  const initGuestId = useAuthStore((state) => state.initGuestId);

  useEffect(() => {
    initGuestId();
  }, [initGuestId]);

  return <Component {...pageProps} />;
}
