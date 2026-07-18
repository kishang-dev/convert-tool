import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileSpreadsheet as Spreadsheet, LuTrash2 as Trash2, LuDownload as Download, LuSettings2 as Settings2, LuCheck as Check, LuTable as TableIcon } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import PdfUploadDropzone from "@/components/PdfUploadDropzone";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fileAPI, FileData } from "@/lib/api";
import * as gtag from "@/lib/gtag";

export default function PdfToCsv() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<FileData[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [delimiter, setDelimiter] = useState(",");
    const [autoDetectTables, setAutoDetectTables] = useState(true);
    const [formatAsExcel, setFormatAsExcel] = useState(false);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles(selectedFiles);
            setFiles(prev => [...prev, ...response.files]);
            showToast(`${response.files.length} PDF(s) uploaded.`);
            setResults([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setResults([]);
        try {
            const convertPromises = files.map(async (file) => {
                // If the user checked "Format as Excel", route it to PDF to Excel instead!
                const response = formatAsExcel 
                    ? await fileAPI.convertToExcel(file._id)
                    : await fileAPI.pdfToCsv(file._id);
                return response.file;
            });

            const processed = await Promise.all(convertPromises);
            setResults(processed.filter(Boolean) as FileData[]);
            showToast(`Successfully extracted ${processed.length} spreadsheet(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "pdf-to-csv" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Conversion failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "PDF to CSV",
        description: "Extract tables and rows from PDFs into CSV format with delimiter options and auto-detection.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/pdf-to-csv",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="PDF to CSV" description="Extract tables and rows from PDFs into CSV format. Features delimiter selection, Excel output, and table auto-detection." canonical="/pdf-to-csv" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'PDF to CSV', href: '/pdf-to-csv' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">PDF to CSV Extractor</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Intelligently detect and extract tabular data from PDF documents and export it cleanly into CSV or Excel format for data analysis.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Extraction Config
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">CSV Delimiter</label>
                                    <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} disabled={formatAsExcel} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none disabled:opacity-50">
                                        <option value=",">Comma (,)</option>
                                        <option value=";">Semicolon (;)</option>
                                        <option value="\t">Tab (\t)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={autoDetectTables} onChange={(e) => setAutoDetectTables(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Auto-Detect Tables</span>
                                </label>
                                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                        <input type="checkbox" checked={formatAsExcel} onChange={(e) => setFormatAsExcel(e.target.checked)} className="text-[var(--accent)]" />
                                        <span>Download as Excel (.xlsx)</span>
                                    </label>
                                </div>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Uploaded PDFs</h3>
                                        <span className="text-xs text-[var(--text-faint)]">{files.length}</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map(f => (
                                            <div key={f._id} className="flex items-center justify-between p-2 bg-[var(--bg)] border border-[var(--border)] rounded text-xs">
                                                <span className="truncate max-w-[150px]">{f.originalName}</span>
                                                <button onClick={() => setFiles(files.filter(file => file._id !== f._id))} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-[var(--border-strong)]">
                            <Button variant="accent" className="w-full" onClick={handleConvert} disabled={processing || uploading || files.length === 0} loading={processing}>
                                {processing ? "Extracting Data..." : "Extract to Spreadsheet"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative overflow-hidden">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg)]">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Extraction Complete!</h3>
                                        <p className="text-sm opacity-90">Generated {results.length} spreadsheet file(s).</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Extract More</Button>
                                        {results.length > 1 && (
                                            <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r), "_blank"), i * 300))}>Download All</Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {results.map((res, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4 p-4 bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><Spreadsheet size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-faint)] mt-1">{formatAsExcel ? 'Excel (.xlsx)' : 'CSV File'}</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6 flex flex-col">
                                <PdfUploadDropzone maxFiles={20} loading={uploading} title="Upload PDF Files" description="Drop PDFs containing tables here to extract them." onFilesSelected={handleFilesSelected} />
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="PDF to CSV" toolDescription="Advanced extraction settings including delimiter selection, table auto-detection, and Excel output format." />
            </main>
            <Footer />
        </div>
    );
}
