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
      name: 'ToolBasketAI',
      description: 'All-in-One Document & PDF Tools — Free Online Toolkit',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://toolbasketai.com/?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://toolbasketai.com/#organization',
      name: 'ToolBasketAI',
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
        title="ToolBasketAI — Free Online Document & PDF Tools"
        description="Convert, merge, split, compress, and edit PDFs, images, and documents entirely free right in your browser. 40+ free tools, no sign-up required."
        canonical="/"
        keywords="free PDF tools, PDF converter online, image resizer, JSON formatter, resume builder, OCR online, merge PDF, compress PDF, ToolBasketAI"
        structuredData={homeStructuredData}
      />
      <Navbar />
      <div className="pt-[57px]">
        <LandingPage />
      </div>
    </>
  );
}
