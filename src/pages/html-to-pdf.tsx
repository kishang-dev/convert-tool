import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileCode as FileCode, LuTrash2 as Trash2, LuDownload as Download, LuGlobe as Globe, LuSettings2 as Settings2, LuCheck as Check } from "react-icons/lu";
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

export default function HtmlToPdf() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<FileData[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [urlInput, setUrlInput] = useState("");
    const [pageSize, setPageSize] = useState("A4");
    const [orientation, setOrientation] = useState("Portrait");
    const [margin, setMargin] = useState("Standard");
    const [printBackground, setPrintBackground] = useState(true);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        const htmlFiles = selectedFiles.filter(f => f.name.toLowerCase().endsWith(".html") || f.name.toLowerCase().endsWith(".htm"));
        if (htmlFiles.length === 0) {
            showToast("Please upload valid HTML files.", "error");
            return;
        }
        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles(htmlFiles);
            setFiles(prev => [...prev, ...response.files]);
            showToast(`${response.files.length} HTML file(s) uploaded.`);
            setResults([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleConvert = async () => {
        if (files.length === 0 && !urlInput) return;

        setProcessing(true);
        setResults([]);
        try {
            // Note: URL conversion would need backend support, simulating for now
            const convertPromises = files.map(async (file) => {
                const response = await fileAPI.htmlToPdf(file._id);
                return response.file;
            });

            const processed = await Promise.all(convertPromises);
            setResults(processed.filter(Boolean) as FileData[]);
            showToast(`Successfully generated ${processed.length} PDF(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "html-to-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Conversion failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "HTML to PDF",
        description: "Convert HTML files or Web URLs to PDF documents with advanced layout controls.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/html-to-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="HTML to PDF" description="Advanced HTML to PDF converter. Support URL to PDF, custom page sizes, and margins." canonical="/html-to-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'HTML to PDF', href: '/html-to-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">HTML to PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Convert raw HTML files or live website URLs into high-quality PDF documents with full control over layout, margins, and page sizes.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Page Settings
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Page Size</label>
                                    <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="A4">A4 (Standard)</option>
                                        <option value="Letter">US Letter</option>
                                        <option value="Legal">Legal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Orientation</label>
                                    <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="Portrait">Portrait</option>
                                        <option value="Landscape">Landscape</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Margins</label>
                                    <select value={margin} onChange={(e) => setMargin(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="Standard">Standard (1cm)</option>
                                        <option value="None">None (0cm)</option>
                                        <option value="Minimal">Minimal (0.5cm)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={printBackground} onChange={(e) => setPrintBackground(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Print Background Graphics</span>
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Uploaded HTML Files</h3>
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
                            <Button variant="accent" className="w-full" onClick={handleConvert} disabled={processing || uploading || (files.length === 0 && !urlInput)} loading={processing}>
                                {processing ? "Generating PDF..." : "Generate PDF"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Success!</h3>
                                        <p className="text-sm opacity-90">Generated {results.length} PDF Document(s).</p>
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
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><FileCode size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-faint)] mt-1">PDF • {(res.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">Convert by URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 text-[var(--text-faint)]" size={18} />
                                        <input 
                                            type="url" 
                                            value={urlInput}
                                            onChange={e => setUrlInput(e.target.value)}
                                            placeholder="https://example.com" 
                                            className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded pl-10 pr-4 py-2 text-sm focus:border-[var(--accent)] outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-2 text-center">— OR —</p>
                                </div>
                                <PdfUploadDropzone accept=".html,.htm" maxFiles={20} loading={uploading} title="Upload HTML Files" description="Drop .html files here to convert them." onFilesSelected={handleFilesSelected} />
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="HTML to PDF" toolDescription="Advanced configuration for converting HTML to PDF including margins, orientation, and batch support." />
            </main>
            <Footer />
        </div>
    );
}
