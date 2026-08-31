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
import { LuTable, LuCloudUpload, LuCopy, LuCheck, LuDownload, LuDollarSign, LuFileSpreadsheet } from "react-icons/lu";

export default function ReceiptOcr() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<any[]>([]);
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
      const result = await ocrApi.receipt(files);
      setExtractedData(result.extracted || null);
      setBatchResults(result.batchResults || []);
      setLineItems(result.extracted?.lineItems || []);
      showToast(`Receipt OCR complete for ${files.length} document(s)!`);
    } catch (err: any) {
      showToast("Receipt OCR failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const updateItemPrice = (idx: number, newPrice: string) => {
    const updated = [...lineItems];
    updated[idx].price = newPrice;
    setLineItems(updated);
  };

  const copyRaw = () => {
    if (!extractedData) return;
    navigator.clipboard.writeText(JSON.stringify(batchResults.length ? batchResults : extractedData, null, 2));
    setCopied(true);
    showToast("Receipt data copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    if (!extractedData) return;
    let csv = "Filename,Merchant,Date,Total,Tax,LineItems\n";
    const records = batchResults.length ? batchResults : [extractedData];
    records.forEach(r => {
      const itemsStr = (r.lineItems || []).map((i: any) => `${i.description}:${i.price}`).join("; ");
      csv += `"${r.filename || "Receipt"}","${r.merchant || ""}","${r.date || ""}","${r.total || ""}","${r.tax || ""}","${itemsStr}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt_expense_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported receipt_expense_report.csv");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Receipt & Invoice OCR - Financial Table Parser & CSV Export" description="Extract merchant names, totals, line items, taxes, and dates from receipts and invoices into CSV/Excel reports." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Receipt & Invoice OCR", href: "/receipt-ocr" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuTable size={14} /> Financial Invoice Parser & Expense Summarizer
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Receipt & Invoice OCR</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract merchant totals, line items, tax breakdown, and dates automatically into structured CSV/Excel reports.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {files.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="receipt-upload" />
                <label htmlFor="receipt-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Receipt / Invoice (Batch Supported)</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports JPG, PNG scans & multiple receipts</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="font-bold text-sm block">{files.length} receipt(s) selected</span>
                    <span className="text-xs text-[var(--text-muted)]">{files.map(f => f.name).join(", ").substring(0, 40)}...</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setExtractedData(null); setBatchResults([]); }}>Change</Button>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Parsing Invoice Data..." : `Parse Receipt Data (${files.length})`}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Parsed Expense Summary</h3>
                  {extractedData && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyRaw} className="gap-1 text-xs text-pink-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={exportCsv} className="gap-1 text-xs text-emerald-400">
                        <LuFileSpreadsheet size={14} /> .CSV
                      </Button>
                    </div>
                  )}
                </div>

                {extractedData !== null ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-pink-500/10 rounded-xl font-bold text-pink-500">
                        Total: {extractedData.total}
                      </div>
                      <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl font-bold text-[var(--text)]">
                        Merchant: {extractedData.merchant}
                      </div>
                    </div>

                    <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl">
                      <h5 className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Parsed Line Items ({lineItems.length})</h5>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {lineItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] p-1 border-b border-[var(--border)]">
                            <span className="truncate max-w-[180px]">{item.description}</span>
                            <input
                              type="text"
                              value={item.price}
                              onChange={e => updateItemPrice(idx, e.target.value)}
                              className="w-16 bg-transparent text-right font-bold text-emerald-400 outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload receipt scan(s) and click parse.
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
            { name: "Export CSV", text: "Download expense report in CSV format." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

