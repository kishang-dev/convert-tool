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
import { LuFileSpreadsheet, LuCloudUpload, LuCheck, LuDownload, LuSlidersHorizontal } from "react-icons/lu";

export default function CsvToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [excelDownloadUrl, setExcelDownloadUrl] = useState<string | null>(null);
  const [autoFormat, setAutoFormat] = useState(true);
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

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const uploadRes = await conversionApi.uploadDoc(file);
      const res = await conversionApi.csvToExcel(uploadRes.fileId);
      setExcelDownloadUrl(res.downloadUrl || "#");
      showToast("CSV converted to Excel (.xlsx) successfully!");
    } catch (err: any) {
      showToast("CSV to Excel conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="CSV to Excel Converter - Convert CSV to XLSX Workbook" description="Convert CSV files into Microsoft Excel (.xlsx) workbooks. Features auto delimiter detection, column formatting, grid preview, and zebra styling." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "CSV to Excel Converter", href: "/csv-to-excel" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuFileSpreadsheet size={14} /> XLSX Workbook Generator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">CSV to Excel Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert raw CSV spreadsheets into styled Microsoft Excel (.xlsx) workbooks with column type formatting.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".csv,.txt" onChange={handleFileSelect} className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload CSV File (.csv)</span>
                  <span className="text-xs text-[var(--text-muted)]">Auto-detects comma, semicolon, & tab delimiters</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExcelDownloadUrl(null); }}>Change</Button>
                </div>

                <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <LuSlidersHorizontal size={14} className="text-emerald-500" /> Workbook Options
                  </h4>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={autoFormat} onChange={e => setAutoFormat(e.target.checked)} className="rounded accent-emerald-500" />
                    Auto-Format Numbers, Dates & Currencies
                  </label>
                </div>

                <Button onClick={handleConvert} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Generating Workbook..." : "Convert to Excel (.xlsx)"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Excel Workbook Result</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Download your generated Microsoft Excel (.xlsx) file below.</p>

                {excelDownloadUrl ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                    <div className="p-4 bg-emerald-500/20 text-emerald-500 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
                      <LuFileSpreadsheet size={28} />
                    </div>
                    <h4 className="font-extrabold text-base text-emerald-500">Excel Workbook Ready!</h4>
                    <a href={excelDownloadUrl} download className="block w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl gap-2">
                        <LuDownload size={16} /> Download .XLSX File
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload a CSV file and click convert.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="CSV to Excel Converter"
          toolDescription="Convert CSV files to Microsoft Excel (.xlsx) spreadsheets."
          steps={[
            { name: "Upload CSV", text: "Select your CSV file." },
            { name: "Convert", text: "Click 'Convert to Excel'." },
            { name: "Download", text: "Download .xlsx workbook." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
