import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { conversionApi } from "@/lib/api";
import { LuImage, LuDownload, LuRefreshCw, LuType, LuPalette } from "react-icons/lu";

export default function TextToImagePage() {
  const [text, setText] = useState("Create Stunning Visual Quotes & Banners");
  const [bgColor, setBgColor] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#38bdf8");
  const [fontSize, setFontSize] = useState(48);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [format, setFormat] = useState("png");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setToast({ message: "Please enter text to render into image.", type: "error" });
      return;
    }

    setLoading(true);
    setResultUrl(null);
    try {
      const res = await conversionApi.textToImage({
        text,
        bgColor,
        textColor,
        fontSize,
        width,
        height,
        format,
      });

      if (res.success && res.downloadUrl) {
        setResultUrl(res.downloadUrl);
        setToast({ message: "Image generated successfully!", type: "success" });
      } else {
        setToast({ message: res.error || "Failed to generate image.", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || "Error rendering text to image.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Text to Image Generator - Free Online Banner & Quote Maker"
        description="Convert custom plain text into high-resolution PNG, JPG, or WebP graphic images with custom colors, dimensions, and typography."
      />
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Image Tools", href: "/#tools" }, { label: "Text to Image", href: "/text-to-image" }]} />

          {/* Header */}
          <div className="text-center my-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <LuImage className="w-4 h-4" /> Graphic Utility
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Text to Image Generator
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Turn your text quotes, titles, social banners, and announcements into high-resolution graphic images in seconds.
            </p>
          </div>

          <AdBanner adSlot="2285841467" />

          {/* Tool Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
            {/* Options Panel */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Input Text
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to convert to image..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <LuPalette className="w-3.5 h-3.5" /> Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <LuType className="w-3.5 h-3.5" /> Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Font Size & Dimensions */}
              <div className="space-y-4 pt-2 border-t border-slate-800/80">
                <div>
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Font Size</span>
                    <span className="text-emerald-400 font-mono">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={16}
                    max={120}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Dimension Presets */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Dimension Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "YouTube (1280x720)", w: 1280, h: 720 },
                      { label: "Twitter/X (1500x500)", w: 1500, h: 500 },
                      { label: "Instagram (1080x1080)", w: 1080, h: 1080 },
                      { label: "Story (1080x1920)", w: 1080, h: 1920 },
                      { label: "FB Cover (820x312)", w: 820, h: 312 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setWidth(preset.w);
                          setHeight(preset.h);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${width === preset.w && height === preset.h
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Output Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["png", "jpg", "webp"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt)}
                        className={`py-2 text-xs font-semibold rounded-xl uppercase transition ${format === fmt
                          ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                          }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LuRefreshCw className="w-5 h-5 animate-spin" /> Rendering Image...
                  </>
                ) : (
                  <>
                    <LuImage className="w-5 h-5" /> Generate Image
                  </>
                )}
              </Button>
            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                  <span>Live Canvas Preview</span>
                  <span className="text-slate-500 font-mono text-[11px]">{width} × {height}</span>
                </h3>

                {/* SVG Live Simulation */}
                <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-center min-h-[300px]">
                  <div
                    className="w-full max-w-full rounded-lg flex items-center justify-center p-6 text-center shadow-inner overflow-hidden transition-all duration-300"
                    style={{
                      aspectRatio: `${Math.max(1, width)} / ${Math.max(1, height)}`,
                      maxHeight: "420px",
                      backgroundColor: bgColor,
                      color: textColor,
                      fontSize: `${Math.max(12, Math.min(28, fontSize * 0.4))}px`,
                      fontWeight: "bold",
                    }}
                  >
                    <span className="whitespace-pre-line leading-snug break-words max-w-full">
                      {text || "Sample Text Preview"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Output Result */}
              {resultUrl && (
                <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    Image ready! Dimensions: <span className="text-white font-mono">{width}x{height}</span> ({format.toUpperCase()})
                  </div>
                  <a
                    href={resultUrl}
                    download={`text-image.${format}`}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <LuDownload className="w-4 h-4" /> Download Image
                  </a>
                </div>
              )}
            </div>
          </div>

          <AdBanner adSlot="2285841467" />

          {/* SEO Content Section */}
          <ToolSEOContent
            toolName="Text to Image Generator"
            toolDescription="Convert custom plain text into high-resolution PNG, JPG, or WebP graphic images with custom colors, dimensions, and typography."
            steps={[
              { name: "Enter Text", text: "Type or paste your quote, title, or announcement text." },
              { name: "Customize Colors & Size", text: "Choose background & text hex colors, font size, and canvas width x height." },
              { name: "Generate & Download", text: "Render into PNG, JPG, or WebP graphic image file and download instantly." }
            ]}
          />
        </main>

        <Footer />

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
