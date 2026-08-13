import React, { useState } from "react";
import AdBanner, { AdFormatType } from "./AdBanner";
import { LuEye as Eye, LuCode as Code, LuCheck as Check, LuCopy as Copy, LuSparkles as Sparkles, LuLayoutGrid as LayoutGrid, LuLayoutPanelLeft as Sidebar, LuSmartphone as Smartphone } from "react-icons/lu";

export default function AdPreviewContainer() {
  const [forcePreview, setForcePreview] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const adFormatsList: Array<{
    id: string;
    title: string;
    description: string;
    format: AdFormatType;
    icon: React.ReactNode;
    codeSnippet: string;
  }> = [
    {
      id: "leaderboard",
      title: "Header / Footer Leaderboard Banner",
      description: "Standard horizontal display banner suitable for page tops, tool headers, and footer placements.",
      format: "responsive",
      icon: <LayoutGrid className="text-blue-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="responsive" adSlot="YOUR_LEADERBOARD_SLOT_ID" label="Advertisement" />`,
    },
    {
      id: "in-article",
      title: "Native In-Article Ad",
      description: "Blends seamlessly into text content, tool descriptions, blog posts, and step-by-step guides.",
      format: "in-article",
      icon: <Sparkles className="text-purple-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="in-article" adSlot="YOUR_IN_ARTICLE_SLOT_ID" />`,
    },
    {
      id: "rectangle",
      title: "Medium Rectangle (300 x 250)",
      description: "High-performing square/rectangle ad unit for sidebar panels and inline tool layout cards.",
      format: "rectangle",
      icon: <Sidebar className="text-emerald-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="rectangle" adSlot="YOUR_RECTANGLE_SLOT_ID" label="Sponsored Content" />`,
    },
    {
      id: "vertical",
      title: "Vertical Skyscraper (160 x 600 / 300 x 600)",
      description: "Tall vertical side banner ideal for long-scrolling tool pages and documentation sidebars.",
      format: "vertical",
      icon: <Sidebar className="text-amber-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="vertical" adSlot="YOUR_VERTICAL_SLOT_ID" />`,
    },
    {
      id: "multiplex",
      title: "Multiplex Content Recommendation Grid",
      description: "Grid-style native recommendation unit placed at bottom of blog posts and tool completion screens.",
      format: "multiplex",
      icon: <LayoutGrid className="text-rose-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="multiplex" adSlot="YOUR_MULTIPLEX_SLOT_ID" />`,
    },
    {
      id: "sticky-bottom",
      title: "Sticky Bottom Anchor Banner",
      description: "Fixed mobile and desktop bottom banner that stays visible while users navigate the tool.",
      format: "sticky-bottom",
      icon: <Smartphone className="text-indigo-500" size={20} />,
      codeSnippet: `<AdBanner adFormat="sticky-bottom" adSlot="YOUR_STICKY_SLOT_ID" />`,
    },
  ];

  const handleCopyCode = (code: string, index: number) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Header Controls & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] shadow-sm mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              AdSense Approved 🎉
            </span>
            <span className="text-xs text-[var(--text-muted)]">Pub ID: ca-pub-4813321349853858</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--text)] font-['Sora',sans-serif]">
            Google AdSense All-in-One Ad Preview Suite
          </h2>
          <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
            Preview, test, and copy code snippets for all AdSense ad types across ToolBasketAI layout placements.
          </p>
        </div>

        {/* Toggle Mode Button */}
        <div className="flex items-center gap-3 bg-[var(--bg)] p-1.5 rounded-xl border border-[var(--border)] self-start md:self-auto">
          <button
            onClick={() => setForcePreview(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              forcePreview
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Eye size={14} /> Blueprint Preview Mode
          </button>
          <button
            onClick={() => setForcePreview(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              !forcePreview
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Sparkles size={14} /> Live AdSense Mode
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "all"
              ? "bg-[var(--accent)] text-white"
              : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
          }`}
        >
          All Ad Formats ({adFormatsList.length})
        </button>
        {adFormatsList.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === item.id
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* Grid Showcase of Ad Formats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {(activeTab === "all" || activeTab === "leaderboard") && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                    <LayoutGrid className="text-blue-500" size={18} /> 1. Leaderboard / Header Banner (Responsive)
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Recommended position: Directly under Navbar or above tool containers.</p>
                </div>
                <button
                  onClick={() => handleCopyCode(adFormatsList[0].codeSnippet, 0)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-xs font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
                >
                  {copiedIndex === 0 ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />} Copy Code
                </button>
              </div>

              <AdBanner adFormat="responsive" forcePreview={forcePreview} label="Top Leaderboard Banner" />
            </div>
          )}

          {(activeTab === "all" || activeTab === "in-article") && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                    <Sparkles className="text-purple-500" size={18} /> 2. Native In-Article Fluid Ad
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Recommended position: Embedded inside long content, instructions, or blogs.</p>
                </div>
                <button
                  onClick={() => handleCopyCode(adFormatsList[1].codeSnippet, 1)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-xs font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
                >
                  {copiedIndex === 1 ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />} Copy Code
                </button>
              </div>

              <div className="p-4 bg-[var(--bg)] rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] leading-relaxed">
                Sample Article Paragraph: Convert your files effortlessly using our high-speed browser-based conversion engine...
              </div>

              <AdBanner adFormat="in-article" forcePreview={forcePreview} label="In-Article Native Ad" />

              <div className="p-4 bg-[var(--bg)] rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)] leading-relaxed">
                Sample Article Paragraph Continued: All processed data is automatically encrypted and wiped for your protection...
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "multiplex") && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                    <LayoutGrid className="text-rose-500" size={18} /> 3. Multiplex Recommendation Grid
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Recommended position: End of tool pages or blog article footers.</p>
                </div>
                <button
                  onClick={() => handleCopyCode(adFormatsList[4].codeSnippet, 4)}
                  className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-xs font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
                >
                  {copiedIndex === 4 ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />} Copy Code
                </button>
              </div>

              <AdBanner adFormat="multiplex" forcePreview={forcePreview} label="Multiplex Grid Unit" />
            </div>
          )}
        </div>

        {/* Sidebar Column (Desktop Rectangle & Vertical Skyscraper) */}
        <div className="lg:col-span-4 space-y-8">
          {(activeTab === "all" || activeTab === "rectangle") && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
                    <Sidebar className="text-emerald-500" size={18} /> 4. Medium Rectangle (300 x 250)
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Sidebar & inline tool panels.</p>
                </div>
                <button
                  onClick={() => handleCopyCode(adFormatsList[2].codeSnippet, 2)}
                  className="px-2 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[11px] font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
                >
                  {copiedIndex === 2 ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />} Copy
                </button>
              </div>

              <div className="flex justify-center">
                <AdBanner adFormat="rectangle" forcePreview={forcePreview} label="Sidebar Rectangle Ad" />
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "vertical") && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
                    <Sidebar className="text-amber-500" size={18} /> 5. Vertical Skyscraper (160 x 600)
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Sticky long sidebars.</p>
                </div>
                <button
                  onClick={() => handleCopyCode(adFormatsList[3].codeSnippet, 3)}
                  className="px-2 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[11px] font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
                >
                  {copiedIndex === 3 ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />} Copy
                </button>
              </div>

              <div className="flex justify-center">
                <AdBanner adFormat="vertical" forcePreview={forcePreview} label="Skyscraper Ad" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Anchor Footer Preview Option */}
      {(activeTab === "all" || activeTab === "sticky-bottom") && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] space-y-4 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                <Smartphone className="text-indigo-500" size={18} /> 6. Sticky Bottom Anchor Banner
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Fixed overlay at the bottom of the user viewport.</p>
            </div>
            <button
              onClick={() => handleCopyCode(adFormatsList[5].codeSnippet, 5)}
              className="px-2.5 py-1 rounded-md bg-[var(--bg)] border border-[var(--border)] text-xs font-medium flex items-center gap-1 hover:border-[var(--accent)] transition-colors"
            >
              {copiedIndex === 5 ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />} Copy Code
            </button>
          </div>

          <AdBanner adFormat="sticky-bottom" forcePreview={forcePreview} label="Sticky Anchor Bar" />
        </div>
      )}
    </section>
  );
}
