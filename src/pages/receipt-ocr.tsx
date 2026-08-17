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
import { LuTable, LuCloudUpload, LuCopy, LuCheck } from "react-icons/lu";

export default function ReceiptOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
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
      const result = await ocrApi.receipt(file);
      setExtractedData(result.extracted || null);
      showToast("Receipt OCR complete!");
    } catch (err: any) {
      showToast("Receipt OCR failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyRaw = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2));
    setCopied(true);
    showToast("Receipt data copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Receipt & Invoice OCR - Extract Totals & Line Items" description="Extract totals, dates, vendors, and line items from receipts and invoices." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Receipt & Invoice OCR", href: "/receipt-ocr" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuTable size={14} /> Invoice Parser
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Receipt & Invoice OCR</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract invoice totals, line items, amounts, and dates automatically from receipt scans.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="receipt-upload" />
                <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Receipt / Invoice</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports JPG, PNG scans</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedData(null); }}>Change</Button>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Extracting Data..." : "Parse Receipt Data"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Parsed Line Items</h3>
                  {extractedData && (
                    <Button size="sm" variant="ghost" onClick={copyRaw} className="gap-1 text-xs text-pink-500">
                      {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy Data"}
                    </Button>
                  )}
                </div>

                {extractedData !== null ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 bg-pink-500/10 rounded-xl font-bold text-pink-500">
                      Detected Total: {extractedData.total}
                    </div>
                    <pre className="bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl max-h-[200px] overflow-auto text-[var(--text)]">
                      {JSON.stringify(extractedData, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload a receipt and click parse.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Receipt & Invoice OCR"
          toolDescription="Automate expense reporting by scanning totals and line items from receipts."
          steps={[
            { name: "Upload Receipt", text: "Upload photo of receipt." },
            { name: "Parse", text: "Click 'Parse Receipt Data'." },
            { name: "Copy Data", text: "Copy extracted totals and line items." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
