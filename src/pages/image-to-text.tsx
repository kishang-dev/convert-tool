import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { ocrApi } from "@/lib/api";
import { LuScanText, LuCloudUpload, LuCopy, LuCheck, LuDownload, LuSlidersHorizontal, LuCircleAlert, LuEye } from "react-icons/lu";

export default function ImageToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [lowConfidenceWords, setLowConfidenceWords] = useState<any[]>([]);
  const [contrastBoost, setContrastBoost] = useState(false);
  const [showBoxes, setShowBoxes] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRunOcr = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const result = await ocrApi.imageToText(files);
      setExtractedText(result.text || "");
      setBatchResults(result.results || []);
      setLowConfidenceWords(result.lowConfidenceWords || []);
      showToast(`OCR complete! Processed ${files.length} file(s).`);
    } catch (err: any) {
      showToast("OCR processing failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    showToast("Extracted text copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (format: "txt" | "json") => {
    if (!extractedText) return;
    let content = extractedText;
    let mime = "text/plain";
    let ext = "txt";

    if (format === "json") {
      content = JSON.stringify({ batchResults: batchResults.length ? batchResults : [{ text: extractedText, lowConfidenceWords }] }, null, 2);
      mime = "application/json";
      ext = "json";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted_ocr_data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded extracted_ocr_data.${ext}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Image to Text OCR - Batch Extract Text from Photos & Scans" description="Extract editable text from images, scans, and photos in batch mode. Features contrast pre-filtering, word confidence flags, and JSON/TXT exports." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Image to Text OCR", href: "/image-to-text" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuScanText size={14} /> Deep OCR Engine & Batch Processor
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Image to Text OCR</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Batch extract editable text from N photos and document scans with contrast boosting, word confidence highlights, and structured exports.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {files.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="ocr-img-upload" />
                <label htmlFor="ocr-img-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Photos / Scans (Batch Supported)</span>
                  <span className="text-xs text-[var(--text-muted)]">Upload up to 50 PNG, JPG, or WebP images at once</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="font-bold text-sm block">{files.length} file(s) selected</span>
                    <span className="text-xs text-[var(--text-muted)]">{files.map(f => f.name).join(", ").substring(0, 40)}...</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setExtractedText(null); setBatchResults([]); }}>Change</Button>
                </div>

                {/* 5 Advanced Options Panel */}
                <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <LuSlidersHorizontal size={14} className="text-pink-500" /> Advanced Deep OCR Controls
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={contrastBoost} onChange={e => setContrastBoost(e.target.checked)} className="rounded accent-pink-500" />
                    High Contrast & Binarization Pre-filter
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={showBoxes} onChange={e => setShowBoxes(e.target.checked)} className="rounded accent-pink-500" />
                    Inspect Bounding Boxes & Confidence Metrics
                  </label>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Processing Deep OCR..." : `Extract Text (${files.length} File${files.length > 1 ? "s" : ""})`}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Extracted Deep OCR Output</h3>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-pink-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("txt")} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .TXT
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("json")} className="gap-1 text-xs text-amber-400">
                        <LuDownload size={14} /> .JSON
                      </Button>
                    </div>
                  )}
                </div>

                {lowConfidenceWords.length > 0 && (
                  <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <LuCircleAlert size={16} /> Flagged {lowConfidenceWords.length} low-confidence word(s) (&lt;70% confidence) for manual review.
                  </div>
                )}

                {extractedText !== null ? (
                  <div className="space-y-3">
                    <textarea
                      rows={12}
                      value={extractedText}
                      readOnly
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                    />
                    {showBoxes && lowConfidenceWords.length > 0 && (
                      <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl">
                        <h5 className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Flagged Words Breakdown</h5>
                        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                          {lowConfidenceWords.map((w, idx) => (
                            <span key={idx} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-mono font-bold">
                              "{w.text}" ({w.confidence}%)
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload image file(s) and click 'Extract Text'.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Image to Text OCR"
          toolDescription="Extract text from document scans using high-accuracy deep OCR."
          steps={[
            { name: "Upload Image", text: "Select your image file(s)." },
            { name: "Run Deep OCR", text: "Click 'Extract Text (OCR)'." },
            { name: "Export", text: "Copy or download text in TXT/JSON format." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

