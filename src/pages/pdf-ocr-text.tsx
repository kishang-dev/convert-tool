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
import { LuFileText, LuCloudUpload, LuCopy, LuCheck, LuSearch, LuDownload, LuLayers } from "react-icons/lu";

export default function PdfOcrText() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [pageResults, setPageResults] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
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
      const result = await ocrApi.pdfText(file, { pageRange });
      setExtractedText(result.text || "");
      setPageResults(result.pageResults || []);
      showToast(`PDF Deep OCR complete! Processed ${result.totalPagesProcessed || 1} page(s).`);
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

  const downloadText = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf_ocr_extracted.txt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded pdf_ocr_extracted.txt");
  };

  const filteredText = searchKeyword.trim()
    ? extractedText?.split("\n").filter(line => line.toLowerCase().includes(searchKeyword.toLowerCase())).join("\n")
    : extractedText;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="PDF Text OCR Scanner - Extract Text from N-Page Scanned PDFs" description="Run deep OCR text recognition on scanned, non-searchable PDF pages. Features page range selector, side-by-side text viewer, and keyword search." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Text OCR Scanner", href: "/pdf-ocr-text" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuFileText size={14} /> Multi-Page PDF Deep OCR Stream
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">PDF Text OCR Scanner</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract text from scanned, image-only, or non-searchable N-page PDF files with page selection ranges and text search.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" id="pdf-ocr-upload" />
                <label htmlFor="pdf-ocr-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Scanned PDF File</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports 100+ page scanned documents</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedText(null); setPageResults([]); }}>Change</Button>
                </div>

                {/* Page range picker */}
                <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Target Page Range (Optional)</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={e => setPageRange(e.target.value)}
                    placeholder="e.g. 1-5, 8, 12-20 (Leave empty for all pages)"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 rounded text-xs font-mono outline-none focus:border-pink-500"
                  />
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Running PDF Deep OCR..." : "Run PDF Deep OCR"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Extracted Text</h3>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-pink-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={downloadText} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .TXT
                      </Button>
                    </div>
                  )}
                </div>

                {extractedText !== null ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        placeholder="Search keyword inside PDF OCR text..."
                        className="w-full pl-9 pr-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-xs outline-none focus:border-pink-500"
                      />
                    </div>
                    <textarea
                      rows={12}
                      value={filteredText || ""}
                      readOnly
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                    />
                  </div>
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
            { name: "Run OCR", text: "Click 'Run PDF Deep OCR'." },
            { name: "Copy & Search", text: "Search keywords or copy extracted text." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

