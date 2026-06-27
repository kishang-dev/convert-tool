import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return (
    <>
      <Head>
        <title>ToolBasket — All-in-One Document & PDF Tools, Free</title>
        <meta name="description" content="Convert, merge, split, compress, and process PDFs, images, and documents instantly. 40+ free tools, no sign-up required." />
      </Head>
      <Navbar />
      <div className="pt-[57px]">
        <LandingPage />
      </div>
    </>
  );
}
