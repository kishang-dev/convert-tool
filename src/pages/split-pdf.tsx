import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { LuArrowLeft as ArrowLeft, LuFileText as FileText, LuTrash2 as Trash2, LuScissors as Scissors, LuCheck as Check, LuX as X, LuDownload as Download } from "react-icons/lu";
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

export interface PdfPreviewPage {
    id: string;
    fileId: string;
    fileName: string;
    pageIndex: number;
    imageUrl: string;
    selected?: boolean;
}

const getAssetUrl = (url: string) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_ASSETS_URL || process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    return baseUrl + (url.startsWith("/") ? url : "/" + url);
};

export default function SplitPdf() {
    const router = useRouter();
    const [file, setFile] = useState<FileData | null>(null);
    const [pages, setPages] = useState<PdfPreviewPage[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [loadingPreviews, setLoadingPreviews] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [mode, setMode] = useState<"extract" | "delete" | "split_all" | "split_ranges">("split_all");
    const [customRanges, setCustomRanges] = useState("");
    
    const [results, setResults] = useState<FileData[]>([]);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadPreviews = async (uploadedFile: FileData) => {
        setLoadingPreviews(true);
        try {
            const previews = await fileAPI.getPreviewImages(uploadedFile._id);
            const images = previews.images || [];
            
            const nextPages = images.map((url, index) => ({
                id: uploadedFile._id + "-" + index,
                fileId: uploadedFile._id,
                fileName: uploadedFile.originalName,
                pageIndex: index,
                imageUrl: getAssetUrl(url) + "?v=" + Date.now(),
                selected: false
            }));

            setPages(nextPages);
            setResults([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to load PDF previews.", "error");
        } finally {
            setLoadingPreviews(false);
        }
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const pdfFile = selectedFiles.find(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
        
        if (!pdfFile) {
            showToast("Please upload a PDF file.", "error");
            return;
        }

        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles([pdfFile]);
            if (response.files && response.files.length > 0) {
                setFile(response.files[0]);
                showToast("PDF uploaded successfully.");
                await loadPreviews(response.files[0]);
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const togglePageSelection = (pageId: string) => {
        setPages(pages.map(p => p.id === pageId ? { ...p, selected: !p.selected } : p));
    };

    const selectAll = (select: boolean) => {
        setPages(pages.map(p => ({ ...p, selected: select })));
    };

    const parseRanges = (rangeText: string, maxPages: number) => {
        const ranges: { start: number, end: number }[] = [];
        const parts = rangeText.split(',').map(p => p.trim()).filter(Boolean);
        
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n, 10));
                if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
                    throw new Error(`Invalid range: ${part}`);
                }
                ranges.push({ start: start - 1, end: end - 1 });
            } else {
                const page = parseInt(part, 10);
                if (isNaN(page) || page < 1 || page > maxPages) {
                    throw new Error(`Invalid page number: ${part}`);
                }
                ranges.push({ start: page - 1, end: page - 1 });
            }
        }
        return ranges;
    };

    const handleAction = async () => {
        if (!file) return;

        setProcessing(true);
        setResults([]);
        try {
            if (mode === "split_all") {
                const response = await fileAPI.splitPDF(file._id);
                setResults(response.files || []);
                showToast(`Split into ${response.files?.length || 0} pages successfully.`);
            } 
            else if (mode === "split_ranges") {
                if (!customRanges.trim()) throw new Error("Please enter ranges.");
                const parsedRanges = parseRanges(customRanges, pages.length);
                const response = await fileAPI.splitPDF(file._id, parsedRanges);
                setResults(response.files || []);
                showToast(`Split into ${response.files?.length || 0} files successfully.`);
            }
            else if (mode === "extract" || mode === "delete") {
                const targetIndices = mode === "extract" 
                    ? pages.filter(p => p.selected).map(p => p.pageIndex)
                    : pages.filter(p => !p.selected).map(p => p.pageIndex);
                
                if (targetIndices.length === 0) {
                    throw new Error(mode === "extract" ? "Please select pages to extract." : "All pages deleted. Nothing to save.");
                }

                const payload = targetIndices.map(index => ({ index, rotation: 0 }));
                const response = await fileAPI.editPDF(file._id, payload);
                if (response.file) {
                    setResults([response.file]);
                    showToast("New PDF created successfully.");
                }
            }
            
            gtag.event({ action: "use_tool", category: "Tool", label: "split-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Operation failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Split PDF",
        description: "Split a PDF file by page ranges, extract single pages, or delete specific pages.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/split-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Split PDF" description="Advanced PDF splitter: extract pages, delete pages, or split into multiple files instantly." canonical="/split-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Split PDF', href: '/split-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Split PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Separate one page or a whole set for easy conversion into independent PDF files. Extract or delete pages visually.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    {!file ? (
                        <div className="w-full">
                            <PdfUploadDropzone maxFiles={1} loading={uploading} title="Upload PDF" description="Drop your PDF here to split, extract, or delete pages." onFilesSelected={handleFilesSelected} />
                        </div>
                    ) : (
                        <>
                            {/* Sidebar Controls */}
                            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] p-6 bg-[var(--bg-elevated)] flex flex-col">
                                <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                                    <div className="flex items-center gap-2 truncate pr-2">
                                        <FileText className="text-[var(--accent)] shrink-0" />
                                        <span className="text-sm font-medium truncate">{file.originalName}</span>
                                    </div>
                                    <button onClick={() => { setFile(null); setPages([]); setResults([]); }} className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Remove PDF">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Select Mode</h3>
                                
                                <div className="space-y-2 mb-6">
                                    {[
                                        { id: "split_all", label: "Split all pages", desc: "Extract every page into a separate PDF" },
                                        { id: "split_ranges", label: "Split by range", desc: "Extract specific page ranges into multiple PDFs" },
                                        { id: "extract", label: "Extract pages (Visual)", desc: "Select pages to keep in a new PDF" },
                                        { id: "delete", label: "Delete pages (Visual)", desc: "Select pages to remove from the PDF" },
                                    ].map(m => (
                                        <label key={m.id} className={`flex flex-col p-3 border rounded cursor-pointer transition-colors ${mode === m.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-strong)] hover:border-[var(--text-muted)]'}`}>
                                            <div className="flex items-center gap-2">
                                                <input type="radio" name="mode" checked={mode === m.id} onChange={() => setMode(m.id as any)} className="text-[var(--accent)]" />
                                                <span className="font-medium text-sm">{m.label}</span>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)] mt-1 ml-5">{m.desc}</span>
                                        </label>
                                    ))}
                                </div>

                                {mode === "split_ranges" && (
                                    <div className="mb-6 animate-fadeIn">
                                        <label className="block text-sm font-medium mb-2 text-[var(--text-muted)]">Ranges (e.g. 1-3, 5, 8-10)</label>
                                        <input type="text" value={customRanges} onChange={e => setCustomRanges(e.target.value)} placeholder={`1-${pages.length}`} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none text-[var(--text)]" />
                                    </div>
                                )}

                                {(mode === "extract" || mode === "delete") && (
                                    <div className="flex gap-2 mb-6">
                                        <button onClick={() => selectAll(true)} className="flex-1 text-xs py-2 bg-[var(--surface-hover)] rounded border border-[var(--border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors text-[var(--text)]">Select All</button>
                                        <button onClick={() => selectAll(false)} className="flex-1 text-xs py-2 bg-[var(--surface-hover)] rounded border border-[var(--border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors text-[var(--text)]">Clear</button>
                                    </div>
                                )}

                                <div className="mt-auto pt-4">
                                    <Button variant="accent" className="w-full" onClick={handleAction} disabled={processing || loadingPreviews || (mode === "split_ranges" && !customRanges)} loading={processing}>
                                        {processing ? "Processing..." : mode === "delete" ? "Delete Pages" : "Split PDF"}
                                    </Button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 bg-[var(--surface)] flex flex-col h-[600px] overflow-hidden relative">
                                {loadingPreviews ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg)]/80 backdrop-blur z-10">
                                        <div className="w-8 h-8 border-4 border-t-[var(--accent)] border-gray-600 rounded-full animate-spin mb-4" />
                                        <p>Loading previews...</p>
                                    </div>
                                ) : null}

                                {results.length > 0 ? (
                                    <div className="flex-1 p-6 overflow-y-auto">
                                        <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded mb-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold mb-1">Success!</h3>
                                                <p className="text-sm">Created {results.length} file(s).</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => setResults([])}>Back</Button>
                                                {results.length > 1 && (
                                                    <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r), "_blank"), i * 300))}>Download All</Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {results.map((res, i) => (
                                                <div key={i} className="p-4 border border-[var(--border-strong)] rounded bg-[var(--bg-elevated)] flex items-center justify-between">
                                                    <div className="min-w-0 pr-4">
                                                        <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                        <p className="text-xs text-[var(--text-muted)] mt-1">{(res.size / 1024).toFixed(1)} KB</p>
                                                    </div>
                                                    <Button size="sm" variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--accent)]" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /></Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg)]">
                                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-[var(--bg)] z-10 pb-2">
                                            <h3 className="font-medium text-sm text-[var(--text)]">Document Pages ({pages.length})</h3>
                                            {(mode === "extract" || mode === "delete") && (
                                                <span className="text-xs text-[var(--accent)] font-medium px-2 py-1 bg-[var(--accent-soft)] rounded">{pages.filter(p => p.selected).length} selected</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {pages.map((page) => (
                                                <div 
                                                    key={page.id} 
                                                    onClick={() => (mode === "extract" || mode === "delete") && togglePageSelection(page.id)}
                                                    className={`relative group bg-[var(--surface)] border rounded overflow-hidden transition-all ${(mode === "extract" || mode === "delete") ? "cursor-pointer hover:shadow-md" : ""} ${page.selected ? "border-[var(--accent)] ring-2 ring-[var(--accent-ring)] shadow-md" : "border-[var(--border-strong)]"}`}
                                                >
                                                    {(mode === "extract" || mode === "delete") && (
                                                        <div className="absolute top-2 left-2 z-10 bg-[var(--bg)]/80 p-1 rounded backdrop-blur border border-[var(--border)]">
                                                            {page.selected ? <Check className="text-[var(--accent)]" size={18} /> : <div className="w-[18px] h-[18px] border-2 border-[var(--text-muted)] rounded-sm" />}
                                                        </div>
                                                    )}
                                                    
                                                    {mode === "delete" && page.selected && (
                                                        <div className="absolute inset-0 bg-red-500/10 z-0 flex items-center justify-center backdrop-blur-[1px]">
                                                            <X className="text-red-500 opacity-90" size={48} />
                                                        </div>
                                                    )}
                                                    
                                                    {mode === "extract" && page.selected && (
                                                        <div className="absolute inset-0 bg-[var(--accent-soft)] z-0 mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
                                                    )}

                                                    <div className="aspect-[3/4] p-3 flex items-center justify-center bg-[var(--bg-elevated)] relative z-0">
                                                        <Image src={page.imageUrl} alt={`Page ${page.pageIndex + 1}`} width={800} height={1131} className="max-w-full max-h-full object-contain shadow-sm border border-[var(--border)] bg-white" />
                                                    </div>
                                                    <div className="p-2 text-center border-t border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-muted)]">
                                                        Page {page.pageIndex + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </section>
                <ToolSEOContent toolName="Split PDF" toolDescription="Advanced options to split, extract, or delete pages from your PDF." steps={[
                    { name: "Upload PDF", text: "Drag and drop or select the PDF file you want to split." },
                    { name: "Choose Mode", text: "Select from 4 powerful modes: Split All, Ranges, Extract, or Delete Pages." },
                    { name: "Process & Download", text: "Process your file and download the specific pages or split files you need." }
                ]} />
            </main>
            <Footer />
        </div>
    );
}
