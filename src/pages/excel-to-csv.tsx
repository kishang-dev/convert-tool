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
import { LuFileSpreadsheet, LuCloudUpload, LuCopy, LuCheck, LuDownload, LuSlidersHorizontal, LuTable } from "react-icons/lu";

export default function ExcelToCsvPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [csvResult, setCsvResult] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(",");
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

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const uploadRes = await conversionApi.uploadDoc(file);
      const csvRes = await conversionApi.excelToCsv(uploadRes.fileId);
      let rawCsv = csvRes.csv || "";
      if (delimiter !== ",") {
        rawCsv = rawCsv.split("\n").map((line: string) => line.split(",").join(delimiter)).join("\n");
      }
      setCsvResult(rawCsv);
      showToast("Excel converted to CSV successfully!");
    } catch (err: any) {
      showToast("Excel conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyCsv = () => {
    if (!csvResult) return;
    navigator.clipboard.writeText(csvResult);
    setCopied(true);
    showToast("CSV text copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (ext: "csv" | "json") => {
    if (!csvResult) return;
    let content = csvResult;
    let mime = "text/csv";
    if (ext === "json") {
      const lines = csvResult.split("\n").filter(Boolean);
      const headers = lines[0]?.split(delimiter) || [];
      const jsonArr = lines.slice(1).map(l => {
        const vals = l.split(delimiter);
        const obj: any = {};
        headers.forEach((h, i) => { obj[h.trim()] = vals[i]?.trim(); });
        return obj;
      });
      content = JSON.stringify(jsonArr, null, 2);
      mime = "application/json";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_spreadsheet.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded converted_spreadsheet.${ext}`);
  };

  const rows = csvResult ? csvResult.split("\n").filter(Boolean) : [];
  const previewHeaders = rows[0]?.split(delimiter) || [];
  const previewRows = rows.slice(1, 6).map(r => r.split(delimiter));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Excel to CSV Converter - Convert XLSX to CSV" description="Convert Microsoft Excel workbooks (.xlsx, .xls) to standard CSV spreadsheets. Features custom delimiters, sheet merging, grid preview, and JSON export." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Excel to CSV Converter", href: "/excel-to-csv" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuFileSpreadsheet size={14} /> Spreadsheet Converter & Data Grid
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Excel to CSV Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert Excel workbooks (.xlsx, .xls) into clean CSV spreadsheets with custom delimiter controls and data grid preview.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" id="excel-upload" />
                <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Excel File (.xlsx, .xls)</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports multi-sheet workbooks</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setCsvResult(null); }}>Change</Button>
                </div>

                <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <LuSlidersHorizontal size={14} className="text-emerald-500" /> Delimiter Options
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Comma (,)", val: "," },
                      { label: "Semicolon (;)", val: ";" },
                      { label: "Tab (\\t)", val: "\t" },
                      { label: "Pipe (|)", val: "|" },
                    ].map((d) => (
                      <button
                        key={d.val}
                        type="button"
                        onClick={() => setDelimiter(d.val)}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition ${delimiter === d.val ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-[var(--border)]"}`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleConvert} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Converting Sheet..." : "Convert to CSV"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Converted CSV Output</h3>
                  {csvResult && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyCsv} className="gap-1 text-xs text-emerald-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("csv")} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .CSV
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("json")} className="gap-1 text-xs text-amber-400">
                        <LuDownload size={14} /> .JSON
                      </Button>
                    </div>
                  )}
                </div>

                {csvResult !== null ? (
                  <div className="space-y-3">
                    {previewHeaders.length > 0 && (
                      <div className="overflow-x-auto border border-[var(--border)] rounded-xl max-h-36">
                        <table className="w-full text-left text-[11px] font-mono">
                          <thead className="bg-[var(--bg)] border-b border-[var(--border)]">
                            <tr>
                              {previewHeaders.map((h, i) => (
                                <th key={i} className="p-2 border-r border-[var(--border)]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewRows.map((r, ri) => (
                              <tr key={ri} className="border-b border-[var(--border)]">
                                {r.map((c, ci) => (
                                  <td key={ci} className="p-2 border-r border-[var(--border)] text-[var(--text-muted)]">{c}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <textarea
                      rows={8}
                      value={csvResult}
                      readOnly
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)]"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload an Excel workbook and click convert.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Excel to CSV Converter"
          toolDescription="Convert Excel workbooks to CSV files."
          steps={[
            { name: "Upload XLSX", text: "Select your Excel file." },
            { name: "Select Delimiter", text: "Choose comma, semicolon, or tab." },
            { name: "Download", text: "Download as CSV or JSON." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
