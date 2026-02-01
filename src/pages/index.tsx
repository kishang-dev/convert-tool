import React from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LandingPage />
      </div>
    </>
  );
}

