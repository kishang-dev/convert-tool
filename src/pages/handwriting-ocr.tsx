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
import { LuScanText, LuCloudUpload, LuCopy, LuCheck, LuSlidersHorizontal, LuDownload, LuPenTool } from "react-icons/lu";

export default function HandwritingOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [psmMode, setPsmMode] = useState<"BLOCK" | "SINGLE_LINE">("BLOCK");
  const [invertColors, setInvertColors] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunOcr = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await ocrApi.handwriting(file, { psm: psmMode });
      setExtractedText(result.text || "");
      setLines(result.lines || []);
      showToast("Handwriting OCR complete!");
    } catch (err: any) {
      showToast("OCR processing failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const updateLineText = (idx: number, newText: string) => {
    const updated = [...lines];
    updated[idx] = newText;
    setLines(updated);
    setExtractedText(updated.join("\n"));
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    showToast("Extracted notes copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportMarkdown = () => {
    if (!extractedText) return;
    const mdContent = `# Handwritten Notes Transcription\n\n${lines.map(l => `- ${l}`).join("\n")}`;
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "handwritten_notes.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported handwritten_notes.md");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO 
        title="Handwriting OCR Scanner - Cursive Notes to Text" 
        description="Recognize handwritten notes and cursive scribbles into editable digital text. Features page segmentation mode tuning, dark mode inversion, and Markdown export." 
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Handwriting OCR Scanner", href: "/handwriting-ocr" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuScanText size={14} /> Cursive & Freehand Recognition Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Handwriting OCR Scanner</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract handwritten notes, journal entries, and whiteboard scribbles into digital text with cursive PSM tuning and line-by-line editing.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="hw-upload" />
                <label htmlFor="hw-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Handwritten Note / Scan</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports photo uploads & cursive handwriting</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedText(null); setLines([]); }}>Change</Button>
                </div>

                <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <LuSlidersHorizontal size={14} className="text-pink-500" /> Handwriting PSM & Tuning
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPsmMode("BLOCK")}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${psmMode === "BLOCK" ? "border-pink-500 bg-pink-500/10 text-pink-500" : "border-[var(--border)]"}`}
                    >
                      Block Layout PSM
                    </button>
                    <button
                      type="button"
                      onClick={() => setPsmMode("SINGLE_LINE")}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${psmMode === "SINGLE_LINE" ? "border-pink-500 bg-pink-500/10 text-pink-500" : "border-[var(--border)]"}`}
                    >
                      Single Line PSM
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={invertColors} onChange={e => setInvertColors(e.target.checked)} className="rounded accent-pink-500" />
                    Dark Mode / White Ink Contrast Inversion
                  </label>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Scanning Handwriting..." : "Scan Handwriting (OCR)"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Digital Notes Result</h3>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-pink-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy Notes"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={exportMarkdown} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .MD
                      </Button>
                    </div>
                  )}
                </div>

                {lines.length > 0 ? (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {lines.map((line, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-xs">
                        <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold">L{idx + 1}</span>
                        <input
                          type="text"
                          value={line}
                          onChange={e => updateLineText(idx, e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none font-mono text-[var(--text)] focus:ring-1 focus:ring-pink-500 rounded px-1"
                        />
                        <LuPenTool size={12} className="text-[var(--text-muted)] shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload a photo of handwritten notes and click scan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Handwriting OCR Scanner"
          toolDescription="Convert handwritten pages into editable digital text."
          steps={[
            { name: "Upload Note", text: "Upload photo of handwriting." },
            { name: "Scan OCR", text: "Click 'Scan Handwriting (OCR)'." },
            { name: "Edit & Export", text: "Edit transcription lines and export to Markdown." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
