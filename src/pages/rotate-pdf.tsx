import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { LuArrowLeft as ArrowLeft, LuFileText as FileText, LuTrash2 as Trash2, LuRotateCw as RotateCw, LuRotateCcw as RotateCcw, LuCheck as Check, LuDownload as Download } from "react-icons/lu";
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
import AdBanner from "@/components/AdBanner";

export interface PdfPreviewPage {
    id: string;
    fileId: string;
    fileName: string;
    pageIndex: number;
    imageUrl: string;
    rotation: number;
    selected: boolean;
}

const getAssetUrl = (url: string) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_ASSETS_URL || process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
    return baseUrl + (url.startsWith("/") ? url : "/" + url);
};

export default function RotatePdf() {
    const router = useRouter();
    const [file, setFile] = useState<FileData | null>(null);
    const [pages, setPages] = useState<PdfPreviewPage[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [loadingPreviews, setLoadingPreviews] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [result, setResult] = useState<FileData | null>(null);

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
                rotation: 0,
                selected: false
            }));

            setPages(nextPages);
            setResult(null);
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

    const rotateAll = (degrees: number) => {
        setPages(pages.map(p => ({ ...p, rotation: (p.rotation + degrees) % 360 })));
    };

    const rotateSelected = (degrees: number) => {
        setPages(pages.map(p => p.selected ? { ...p, rotation: (p.rotation + degrees) % 360 } : p));
    };

    const rotatePage = (pageId: string, degrees: number) => {
        setPages(pages.map(p => p.id === pageId ? { ...p, rotation: (p.rotation + degrees) % 360 } : p));
    };

    const selectAll = (select: boolean) => setPages(pages.map(p => ({ ...p, selected: select })));
    const selectOdd = () => setPages(pages.map((p, i) => ({ ...p, selected: i % 2 === 0 })));
    const selectEven = () => setPages(pages.map((p, i) => ({ ...p, selected: i % 2 !== 0 })));
    const deleteSelected = () => setPages(pages.filter(p => !p.selected));

    const handleAction = async () => {
        if (!file) return;
        if (pages.length === 0) {
            showToast("No pages to rotate or save.", "error");
            return;
        }

        setProcessing(true);
        setResult(null);
        try {
            const payload = pages.map(p => ({ index: p.pageIndex, rotation: p.rotation }));
            const response = await fileAPI.editPDF(file._id, payload);
            
            if (response.file) {
                setResult(response.file);
                showToast("PDF rotated and saved successfully.");
            }
            gtag.event({ action: "use_tool", category: "Tool", label: "rotate-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Operation failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Rotate PDF",
        description: "Advanced tool to rotate all PDF pages, selected pages, or individual pages easily.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/rotate-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Rotate PDF" description="Rotate all PDF pages, odd/even pages, or specific pages individually with visual preview." canonical="/rotate-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Rotate PDF', href: '/rotate-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Rotate PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Hover over any page to rotate it. Use the sidebar to rotate all pages, just odd/even pages, or even delete unwanted pages before saving.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    {!file ? (
                        <div className="w-full">
                            <PdfUploadDropzone maxFiles={1} loading={uploading} title="Upload PDF" description="Drop your PDF here to rotate pages." onFilesSelected={handleFilesSelected} />
                        </div>
                    ) : (
                        <>
                            {/* Sidebar Controls */}
                            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] p-6 bg-[var(--bg-elevated)] flex flex-col overflow-y-auto">
                                <div className="flex items-center justify-between mb-6 border-b border-[var(--border)] pb-4">
                                    <div className="flex items-center gap-2 truncate pr-2">
                                        <FileText className="text-[var(--accent)] shrink-0" />
                                        <span className="text-sm font-medium truncate">{file.originalName}</span>
                                    </div>
                                    <button onClick={() => { setFile(null); setPages([]); setResult(null); }} className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Remove PDF">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Global Rotation</h3>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    <button onClick={() => rotateAll(-90)} className="flex items-center justify-center gap-2 p-2 border border-[var(--border-strong)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-sm font-medium">
                                        <RotateCcw size={16} /> Left
                                    </button>
                                    <button onClick={() => rotateAll(90)} className="flex items-center justify-center gap-2 p-2 border border-[var(--border-strong)] rounded hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors text-sm font-medium">
                                        Right <RotateCw size={16} />
                                    </button>
                                </div>

                                <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Batch Selection</h3>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button onClick={() => selectAll(true)} className="p-2 border border-[var(--border)] rounded text-xs hover:bg-[var(--surface-hover)]">Select All</button>
                                    <button onClick={() => selectAll(false)} className="p-2 border border-[var(--border)] rounded text-xs hover:bg-[var(--surface-hover)]">Clear All</button>
                                    <button onClick={selectOdd} className="p-2 border border-[var(--border)] rounded text-xs hover:bg-[var(--surface-hover)]">Select Odd</button>
                                    <button onClick={selectEven} className="p-2 border border-[var(--border)] rounded text-xs hover:bg-[var(--surface-hover)]">Select Even</button>
                                </div>

                                {pages.filter(p => p.selected).length > 0 && (
                                    <div className="mb-6 p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded animate-fadeIn">
                                        <p className="text-xs font-medium mb-2 text-center text-[var(--accent)]">{pages.filter(p => p.selected).length} pages selected</p>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <button onClick={() => rotateSelected(-90)} className="flex justify-center p-1.5 border border-[var(--border)] bg-[var(--bg)] rounded hover:text-[var(--accent)]"><RotateCcw size={14}/></button>
                                            <button onClick={() => rotateSelected(90)} className="flex justify-center p-1.5 border border-[var(--border)] bg-[var(--bg)] rounded hover:text-[var(--accent)]"><RotateCw size={14}/></button>
                                        </div>
                                        <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-2 p-2 border border-red-500/20 text-red-500 rounded text-xs hover:bg-red-500/10"><Trash2 size={14}/> Delete Selected</button>
                                    </div>
                                )}

                                <div className="mt-auto pt-6">
                                    <Button variant="accent" className="w-full" onClick={handleAction} disabled={processing || loadingPreviews || pages.length === 0} loading={processing}>
                                        {processing ? "Applying Changes..." : "Apply Changes"}
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

                                {result ? (
                                    <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center">
                                        <div className="w-full max-w-md bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg text-center shadow-lg">
                                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">PDF Ready!</h3>
                                            <p className="text-sm mb-6 opacity-90">Your rotated PDF has been successfully created.</p>
                                            <div className="flex flex-col gap-3">
                                                <Button size="lg" className="w-full flex justify-center gap-2" onClick={() => window.open(fileAPI.getDownloadUrl(result), "_blank")}>
                                                    <Download size={18} /> Download Rotated PDF
                                                </Button>
                                                <Button size="md" variant="secondary" className="w-full" onClick={() => setResult(null)}>Back to Editor</Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 p-6 overflow-y-auto bg-[var(--bg)]">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                            {pages.map((page) => (
                                                <div 
                                                    key={page.id} 
                                                    className={`relative group bg-[var(--surface)] border rounded overflow-hidden transition-all ${page.selected ? "border-[var(--accent)] ring-2 ring-[var(--accent-ring)] shadow-md" : "border-[var(--border-strong)] hover:border-[var(--text-muted)]"}`}
                                                >
                                                    {/* Selection Toggle */}
                                                    <div className="absolute top-2 left-2 z-10 bg-[var(--bg)]/80 p-1 rounded backdrop-blur border border-[var(--border)] cursor-pointer" onClick={() => togglePageSelection(page.id)}>
                                                        {page.selected ? <Check className="text-[var(--accent)]" size={18} /> : <div className="w-[18px] h-[18px] border-2 border-[var(--text-muted)] rounded-sm" />}
                                                    </div>
                                                    
                                                    {/* Quick Hover Rotate Buttons */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={(e) => { e.stopPropagation(); rotatePage(page.id, -90); }} className="p-2 bg-[var(--bg)]/90 backdrop-blur rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] shadow-lg" title="Rotate Left">
                                                            <RotateCcw size={20} />
                                                        </button>
                                                        <button onClick={(e) => { e.stopPropagation(); rotatePage(page.id, 90); }} className="p-2 bg-[var(--bg)]/90 backdrop-blur rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] shadow-lg" title="Rotate Right">
                                                            <RotateCw size={20} />
                                                        </button>
                                                    </div>

                                                    <div className="aspect-[3/4] p-3 flex items-center justify-center bg-[var(--bg-elevated)] relative z-0 cursor-pointer" onClick={() => togglePageSelection(page.id)}>
                                                        <Image 
                                                            src={page.imageUrl} 
                                                            alt={`Page ${page.pageIndex + 1}`}
                                                            width={800} height={1131} 
                                                            style={{ transform: `rotate(${page.rotation}deg)` }}
                                                            className="max-w-full max-h-full object-contain shadow-sm border border-[var(--border)] bg-white transition-transform duration-300" 
                                                        />
                                                    </div>
                                                    <div className="p-2 flex justify-between items-center border-t border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-muted)]">
                                                        <span>Page {page.pageIndex + 1}</span>
                                                        {page.rotation !== 0 && <span className="text-[var(--accent)]">{page.rotation}°</span>}
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
                <ToolSEOContent toolName="Rotate PDF" toolDescription="Professional rotation tool: select odd/even pages, batch rotate, or delete unwanted pages before finalizing your PDF." />
            </main>
            <Footer />
        </div>
    );
}
