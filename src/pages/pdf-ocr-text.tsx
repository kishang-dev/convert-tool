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
import { LuFileText, LuCloudUpload, LuCopy, LuCheck } from "react-icons/lu";

export default function PdfOcrText() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
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
      const result = await ocrApi.pdfText(file);
      setExtractedText(result.text || "");
      showToast("PDF OCR complete!");
    } catch (err: any) {
      showToast("PDF OCR failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    showToast("Extracted PDF text copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="PDF Text OCR Scanner - Extract Text from Scanned PDFs" description="Run OCR text recognition on scanned non-searchable PDF pages." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Text OCR Scanner", href: "/pdf-ocr-text" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuFileText size={14} /> PDF OCR Scanner
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">PDF Text OCR Scanner</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract text from scanned, image-only, or non-searchable PDF files using advanced OCR.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" id="pdf-ocr-upload" />
                <label htmlFor="pdf-ocr-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Scanned PDF</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports multi-page scanned PDFs</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedText(null); }}>Change</Button>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Running PDF OCR..." : "Run PDF OCR Scanner"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Extracted Text</h3>
                  {extractedText && (
                    <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-pink-500">
                      {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy Text"}
                    </Button>
                  )}
                </div>

                {extractedText !== null ? (
                  <textarea
                    rows={10}
                    value={extractedText}
                    readOnly
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)]"
                  />
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload a scanned PDF file and click scan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Text OCR Scanner"
          toolDescription="Run optical character recognition on non-searchable PDF files."
          steps={[
            { name: "Upload PDF", text: "Select scanned PDF file." },
            { name: "Run OCR", text: "Click 'Run PDF OCR Scanner'." },
            { name: "Copy", text: "Copy extracted text output." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
