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
import AdBanner from "@/components/AdBanner";

export default function PdfToHtml() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<FileData[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [outputMode, setOutputMode] = useState("single");
    const [embedImages, setEmbedImages] = useState(true);
    const [extractRaw, setExtractRaw] = useState(false);

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
                const response = await fileAPI.pdfToHtml(file._id);
                return response.file;
            });

            const processed = await Promise.all(convertPromises);
            setResults(processed.filter(Boolean) as FileData[]);
            showToast(`Successfully generated ${processed.length} HTML file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "pdf-to-html" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Conversion failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "PDF to HTML",
        description: "Export PDF documents into responsive HTML web pages with CSS preservation and image embedding.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/pdf-to-html",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="PDF to HTML" description="Advanced PDF to HTML converter. Extract raw layout, embed images in Base64, and output to single or multiple pages." canonical="/pdf-to-html" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'PDF to HTML', href: '/pdf-to-html' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">PDF to HTML Web Page</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Convert any PDF directly into a clean, responsive HTML structure. Perfect for displaying documents natively on the web.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Output Configuration
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">HTML Structure</label>
                                    <select value={outputMode} onChange={(e) => setOutputMode(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="single">Single Continuous Page</option>
                                        <option value="multiple">Separate Page Files (Multi-HTML)</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={embedImages} onChange={(e) => setEmbedImages(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Embed Images (Base64)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={extractRaw} onChange={(e) => setExtractRaw(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Extract Raw HTML (Ignore Styling)</span>
                                </label>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Uploaded PDF Files</h3>
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
                                {processing ? "Generating HTML..." : "Convert to HTML"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Success!</h3>
                                        <p className="text-sm opacity-90">Generated {results.length} HTML Web Page(s).</p>
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
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><Globe size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-faint)] mt-1">HTML • {(res.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Globe size={16} className="mr-1" /> View in Browser</Button>
                                                <Button size="sm" variant="secondary" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6 flex flex-col">
                                <PdfUploadDropzone maxFiles={20} loading={uploading} title="Upload PDF Files" description="Drop PDF files here to convert them into HTML pages." onFilesSelected={handleFilesSelected} />
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="PDF to HTML" toolDescription="Advanced settings for CSS preservation, image embedding, and structure controls." />
            </main>
            <Footer />
        </div>
    );
}
