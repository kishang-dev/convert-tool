import React from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import SEO from '@/components/SEO';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://toolbasketai.com/#website',
      url: 'https://toolbasketai.com/',
      name: 'ToolBasket',
      description: 'All-in-One Document & PDF Tools — Free Online Toolkit',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://toolbasketai.com/tools?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://toolbasketai.com/#organization',
      name: 'ToolBasket',
      url: 'https://toolbasketai.com/',
      logo: { '@type': 'ImageObject', url: 'https://toolbasketai.com/favicon.ico' },
      sameAs: [],
    },
  ],
};

export default function Home() {
  return (
    <>
      <SEO
        canonical="/"
        structuredData={homeStructuredData}
      />
      <Navbar />
      <div className="pt-[57px]">
        <LandingPage />
      </div>
    </>
  );
}
