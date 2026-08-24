import React from 'react';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/LandingPage';
import SEO from '@/components/SEO';

export default function Home() {
  const homeFaqs = [
    { question: 'What is ToolBasketAI?', answer: 'ToolBasketAI is an all-in-one free online suite of 75+ document, PDF, image, developer, and AI tools.' },
    { question: 'Are all tools 100% free to use?', answer: 'Yes, all tools are completely free with no usage limits or hidden subscription fees.' },
    { question: 'Is my uploaded data safe and private?', answer: 'All file processing is encrypted. Files uploaded to servers are automatically deleted within 24 hours, and text/developer tools run 100% client-side in your browser.' }
  ];

  return (
    <>
      <SEO
        title="ToolBasketAI — Free Online PDF, Image, Developer & AI Tools"
        description="Convert, merge, split, compress, and edit PDFs, images, code, and documents for free. 75+ free online browser tools with zero registration."
        canonical="/"
        keywords="free PDF converter, merge PDF online, compress PDF, image resizer, JSON formatter, online OCR, AI resume builder, ToolBasketAI"
        isHomePage={true}
        faqItems={homeFaqs}
      />
      <Navbar />
      <div className="pt-[57px]">
        <LandingPage />
      </div>
    </>
  );
}
