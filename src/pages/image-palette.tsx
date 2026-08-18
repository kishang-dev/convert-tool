import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { fileAPI, FileData, conversionApi } from "@/lib/api";
import { LuPenTool, LuImage, LuCloudUpload, LuCopy, LuCheck } from "react-icons/lu";

export default function ImagePalette() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(6);
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const response = await fileAPI.uploadFiles([e.target.files[0]]);
      setFile(response.files[0]);
      showToast("Image uploaded.");
    } catch (err: any) {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await conversionApi.extractPalette(file._id, count);
      setPalette(result.palette || []);
      showToast("Color palette extracted!");
    } catch (err: any) {
      showToast("Failed to extract palette.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard!`);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyCssVars = () => {
    if (palette.length === 0) return;
    const cssText = palette.map((hex, i) => `--color-${i + 1}: ${hex};`).join("\n");
    navigator.clipboard.writeText(cssText);
    showToast("CSS Variables copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Image Color Palette Extractor - Get Hex Color Codes" description="Extract primary color palettes and hex codes from uploaded images." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Image Color Palette Extractor", href: "/image-palette" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuPenTool size={14} /> Palette Picker
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Extract Image Color Palette</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract dominant hex colors and visual design palettes directly from any photo or visual graphic.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="palette-upload" />
                <label htmlFor="palette-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Photo / Image</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports PNG, JPG, WebP</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <LuImage size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Ready for palette extraction</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPalette([]); }}>Change</Button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Number of Swatches</label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[4, 6, 8, 12].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCount(cnt)}
                        className={`py-2 rounded-xl border text-xs font-bold transition ${count === cnt
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]"
                          }`}
                      >
                        {cnt} Colors
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleExtract} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Extracting Colors..." : "Extract Color Palette"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Extracted Palette</h3>
                {palette.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={copyCssVars} className="text-xs text-emerald-500 font-bold border border-emerald-500/20">
                    Copy CSS Vars
                  </Button>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-6">Click any swatch to copy its Hex color code.</p>

              {palette.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {palette.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => copyHex(hex)}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] flex items-center justify-between hover:border-emerald-500 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg border shadow-sm" style={{ backgroundColor: hex }} />
                        <span className="font-mono text-xs font-bold uppercase">{hex}</span>
                      </div>
                      {copiedHex === hex ? <LuCheck className="text-emerald-500" size={14} /> : <LuCopy className="text-[var(--text-muted)]" size={14} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                  Upload an image to reveal color swatches.
                </div>
              )}
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Image Color Palette Extractor"
          toolDescription="Extract dominant color schemes and hex swatches from images for web and UI design."
          steps={[
            { name: "Upload Photo", text: "Select an image file." },
            { name: "Extract Colors", text: "Click 'Extract Color Palette'." },
            { name: "Copy Hex", text: "Click any color swatch to copy its Hex code." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
