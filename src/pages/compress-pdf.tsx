import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileText as FileText, LuTrash2 as Trash2, LuDownload as Download, LuMinimize2 as Minimize2, LuCheck as Check } from "react-icons/lu";
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

const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function CompressPdf() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<{ original: FileData, compressed: FileData }[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [compressionLevel, setCompressionLevel] = useState<"recommended" | "extreme" | "less">("recommended");

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;
        const pdfFiles = selectedFiles.filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
        
        if (pdfFiles.length === 0) {
            showToast("Please upload PDF files only.", "error");
            return;
        }

        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles(pdfFiles);
            setFiles(prev => [...prev, ...response.files]);
            showToast(`${response.files.length} file(s) uploaded successfully.`);
            setResults([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (id: string) => {
        setFiles(files.filter(f => f._id !== id));
    };

    const handleCompress = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setResults([]);
        try {
            const compressPromises = files.map(async (file) => {
                const response = await fileAPI.compressPDF(file._id);
                return { original: file, compressed: response.file };
            });

            const processed = await Promise.all(compressPromises);
            setResults(processed);
            showToast(`Successfully compressed ${processed.length} file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "compress-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Compression failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const getTotalSavings = () => {
        if (results.length === 0) return { bytes: 0, percent: 0 };
        const totalOrig = results.reduce((sum, r) => sum + r.original.size, 0);
        const totalComp = results.reduce((sum, r) => sum + r.compressed.size, 0);
        const saved = totalOrig - totalComp;
        return {
            bytes: saved > 0 ? saved : 0,
            percent: totalOrig > 0 && saved > 0 ? Math.round((saved / totalOrig) * 100) : 0
        };
    };

    const savings = getTotalSavings();

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Compress PDF",
        description: "Batch compress multiple PDFs, reduce file size instantly, and compare before/after sizes.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/compress-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Compress PDF" description="Reduce PDF file sizes instantly. Batch compress multiple PDFs while maintaining high quality." canonical="/compress-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Compress PDF', href: '/compress-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Compress PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Batch compress up to 50 PDFs at once. Significantly reduce file size for easy emailing and sharing without losing quality.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Compression Level</h3>
                            
                            <div className="space-y-2 mb-6">
                                {[
                                    { id: "recommended", label: "Recommended", desc: "Good quality, good compression" },
                                    { id: "extreme", label: "Extreme", desc: "Lower quality, max compression (coming soon)", disabled: true },
                                    { id: "less", label: "Less Compression", desc: "High quality, less compression (coming soon)", disabled: true },
                                ].map(m => (
                                    <label key={m.id} className={`flex flex-col p-3 border rounded transition-colors ${m.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${compressionLevel === m.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border-strong)] hover:border-[var(--text-muted)]'}`}>
                                        <div className="flex items-center gap-2">
                                            <input type="radio" disabled={m.disabled} checked={compressionLevel === m.id} onChange={() => setCompressionLevel(m.id as any)} className="text-[var(--accent)]" />
                                            <span className="font-medium text-sm">{m.label}</span>
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)] mt-1 ml-5">{m.desc}</span>
                                    </label>
                                ))}
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Uploaded Files</h3>
                                        <span className="text-xs text-[var(--text-faint)]">{files.length}/50</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map(f => (
                                            <div key={f._id} className="flex items-center justify-between p-2 bg-[var(--bg)] border border-[var(--border)] rounded text-xs">
                                                <span className="truncate max-w-[150px]">{f.originalName}</span>
                                                <button onClick={() => removeFile(f._id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setFiles([])} className="mt-3 text-xs text-red-500 hover:underline w-full text-center">Clear All</button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-[var(--border-strong)]">
                            <Button variant="accent" className="w-full" onClick={handleCompress} disabled={processing || uploading || files.length === 0} loading={processing}>
                                {processing ? "Compressing..." : "Compress PDFs"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Success!</h3>
                                        <p className="text-sm opacity-90">Saved {formatSize(savings.bytes)} ({savings.percent}% reduction).</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Compress More</Button>
                                        {results.length > 1 && (
                                            <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r.compressed), "_blank"), i * 300))}>Download All</Button>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-sm font-semibold mb-4 text-[var(--text)]">Results ({results.length})</h3>
                                <div className="space-y-3">
                                    {results.map((res, i) => {
                                        const orig = res.original.size;
                                        const comp = res.compressed.size;
                                        const perc = orig > 0 ? Math.round(((orig - comp) / orig) * 100) : 0;
                                        
                                        return (
                                            <div key={i} className="p-4 border border-[var(--border-strong)] rounded bg-[var(--bg-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><Minimize2 size={20}/></div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-[var(--text)] truncate">{res.compressed.filename}</p>
                                                        <div className="flex items-center gap-2 text-xs mt-1">
                                                            <span className="text-[var(--text-faint)] line-through">{formatSize(orig)}</span>
                                                            <span className="text-[var(--accent)] font-medium">{formatSize(comp)}</span>
                                                            {perc > 0 && <span className="bg-green-500/20 text-green-500 px-1.5 rounded-sm">-{perc}%</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--accent)] shrink-0" onClick={() => window.open(fileAPI.getDownloadUrl(res.compressed), "_blank")}><Download size={16} /> Download</Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6">
                                <PdfUploadDropzone maxFiles={50} loading={uploading} title="Upload PDFs" description="Drop up to 50 PDF files here to compress them at once." onFilesSelected={handleFilesSelected} />
                                
                                {files.length === 0 && (
                                    <div className="mt-12 text-center text-[var(--text-muted)]">
                                        <Minimize2 size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-sm">Your compressed PDFs will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="Compress PDF" toolDescription="Batch compress up to 50 PDFs at once. Perfect for shrinking large documents to fit email attachment limits." />
            </main>
            <Footer />
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: var(--bg); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
            `}</style>
        </div>
    );
}
