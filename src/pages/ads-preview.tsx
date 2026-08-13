import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import AdPreviewContainer from "@/components/AdPreviewContainer";

export default function AdsPreviewPage() {
  return (
    <>
      <SEO
        title="AdSense Ad Types Preview Suite"
        description="Comprehensive preview and testing tool for all Google AdSense ad formats on ToolBasketAI."
        noIndex={true} // Keep private/internal testing page unindexed from search engines
      />
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 py-6">
          <AdPreviewContainer />
        </main>
        <Footer />
      </div>
    </>
  );
}
