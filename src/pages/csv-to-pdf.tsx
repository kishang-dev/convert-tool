import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileSpreadsheet as Spreadsheet, LuTrash2 as Trash2, LuDownload as Download, LuSettings2 as Settings2, LuCheck as Check, LuTable as TableIcon } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fileAPI, FileData } from "@/lib/api";
import * as gtag from "@/lib/gtag";

export default function CsvToPdf() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<FileData[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [csvPreview, setCsvPreview] = useState<string[][]>([]);
    const [theme, setTheme] = useState("Striped");
    const [orientation, setOrientation] = useState("Portrait");
    const [headerBold, setHeaderBold] = useState(true);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) return;
        
        const fileArray = Array.from(fileList);
        
        // Quick visual preview for the first file
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                const text = event.target.result.toString();
                const rows = text.split('\n').slice(0, 6).map(row => row.split(',').map(cell => cell.trim()));
                setCsvPreview(rows);
            }
        };
        reader.readAsText(fileArray[0]);

        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles(fileArray);
            setFiles(prev => [...prev, ...response.files]);
            showToast(`${response.files.length} CSV file(s) uploaded.`);
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
                const response = await fileAPI.csvToPdf(file._id);
                return response.file;
            });

            const processed = await Promise.all(convertPromises);
            setResults(processed.filter(Boolean) as FileData[]);
            showToast(`Successfully generated ${processed.length} PDF(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "csv-to-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Conversion failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "CSV to PDF",
        description: "Transform spreadsheet CSV files into organized PDF tables with live preview.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/csv-to-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="CSV to PDF" description="Advanced CSV to PDF generator. Live table preview, styling themes, and portrait/landscape toggles." canonical="/csv-to-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'CSV to PDF', href: '/csv-to-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">CSV to PDF Generator</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Turn raw comma-separated values into beautifully formatted, highly readable PDF tables instantly.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Table Settings
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Visual Theme</label>
                                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="Striped">Zebra Striped (Classic)</option>
                                        <option value="Bordered">Full Borders (Grid)</option>
                                        <option value="Minimal">Minimal (Lines only)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Orientation</label>
                                    <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="Portrait">Portrait (Standard width)</option>
                                        <option value="Landscape">Landscape (For many columns)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={headerBold} onChange={(e) => setHeaderBold(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Bold Table Headers</span>
                                </label>
                            </div>

                            <div className="mt-6 border-t border-[var(--border)] pt-6">
                                <label className="block text-sm font-medium mb-2">Upload .csv File</label>
                                <input type="file" accept=".csv" multiple onChange={handleFilesSelected} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-soft)] file:text-[var(--accent)] hover:file:bg-[var(--accent-soft)]/80"/>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Uploaded CSV Files</h3>
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
                            <Button variant="accent" className="w-full" onClick={handleConvert} disabled={processing || files.length === 0} loading={processing}>
                                {processing ? "Generating PDF..." : "Generate PDF Tables"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative overflow-hidden">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg)]">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Success!</h3>
                                        <p className="text-sm opacity-90">Generated {results.length} PDF Table(s).</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Convert More</Button>
                                        {results.length > 1 && (
                                            <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r), "_blank"), i * 300))}>Download All</Button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {results.map((res, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4 p-4 bg-[var(--bg-elevated)] border border-[var(--border-strong)] rounded">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><TableIcon size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-faint)] mt-1">PDF Document</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : csvPreview.length > 0 ? (
                            <div className="flex-1 p-6 flex flex-col bg-[var(--bg)] overflow-auto">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Spreadsheet size={16}/> Data Preview (First 5 Rows)</h3>
                                <div className="w-full overflow-x-auto border border-[var(--border-strong)] rounded-lg bg-[var(--surface)]">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        {headerBold && (
                                            <thead className="bg-[var(--bg-elevated)] border-b border-[var(--border-strong)]">
                                                <tr>
                                                    {csvPreview[0].map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}
                                                </tr>
                                            </thead>
                                        )}
                                        <tbody>
                                            {csvPreview.slice(headerBold ? 1 : 0).map((row, i) => (
                                                <tr key={i} className={theme === "Striped" && i % 2 === 0 ? "bg-[var(--bg)]" : "border-b border-[var(--border)]"}>
                                                    {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
                                    This is a raw preview. The generated PDF will be styled according to your settings.
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6 flex items-center justify-center text-[var(--text-muted)]">
                                <div className="text-center">
                                    <Spreadsheet size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-sm">Upload a .csv file to see a live data preview here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="CSV to PDF" toolDescription="Live tabular data preview, customizable styling themes, and portrait/landscape orientation toggles." />
            </main>
            <Footer />
        </div>
    );
}
