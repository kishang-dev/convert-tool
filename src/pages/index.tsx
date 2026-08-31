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
        title="ToolBasketAI — 75+ Free Online PDF, Image, Developer & AI Tools"
        description="Convert, merge, split, compress PDFs, resize images, format JSON/SQL client-side, extract OCR text, and build AI resumes online for free. 100% private, no signup, no watermark."
        canonical="/"
        keywords={[
          "free online pdf tools",
          "merge pdf free",
          "compress pdf online",
          "pdf to word converter",
          "word to pdf online",
          "image resizer online by pixel",
          "compress png jpg webp",
          "json formatter online client side",
          "ai resume builder free",
          "extract text from image ocr",
          "no watermark free tools",
          "ToolBasketAI"
        ]}
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
