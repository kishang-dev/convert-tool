import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileText as FileText, LuTrash2 as Trash2, LuDownload as Download, LuSettings2 as Settings2, LuCheck as Check, LuImage as ImageIcon, LuFileSpreadsheet as ExcelIcon, LuFile as GenericFile, LuMonitorPlay as PptIcon } from "react-icons/lu";
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

export interface BatchConverterPageProps {
    toolId: string;
    title: string;
    description: string;
    acceptedFiles: string;
    outputLabel: string;
    iconType: "pdf" | "word" | "excel" | "image" | "ppt";
    runConversion: (fileId: string) => Promise<{ success: boolean; file?: FileData; files?: FileData[]; message?: string }>;
}

const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function BatchConverterPage({ toolId, title, description, acceptedFiles, outputLabel, iconType, runConversion }: BatchConverterPageProps) {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<{ original: FileData, converted: FileData[] }[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [quality, setQuality] = useState<"high" | "standard" | "fast">("standard");
    const [useOcr, setUseOcr] = useState(false);

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
            showToast(`${response.files.length} file(s) uploaded successfully.`);
            setResults([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (id: string) => setFiles(files.filter(f => f._id !== id));

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setResults([]);
        try {
            const convertPromises = files.map(async (file) => {
                const response = await runConversion(file._id);
                const outFiles = response.files ? response.files : (response.file ? [response.file] : []);
                return { original: file, converted: outFiles };
            });

            const processed = await Promise.all(convertPromises);
            setResults(processed);
            
            const totalOut = processed.reduce((sum, p) => sum + p.converted.length, 0);
            showToast(`Successfully converted into ${totalOut} file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: toolId });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Conversion failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const getIcon = () => {
        switch (iconType) {
            case "pdf": return <FileText size={20} />;
            case "word": return <FileText size={20} />;
            case "excel": return <ExcelIcon size={20} />;
            case "image": return <ImageIcon size={20} />;
            case "ppt": return <PptIcon size={20} />;
            default: return <GenericFile size={20} />;
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: title,
        description: description,
        applicationCategory: "BrowserApplication",
        url: `https://toolbasketai.com/${toolId}`,
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title={title} description={description} canonical={`/${toolId}`} structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: title, href: `/${toolId}` }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">{title}</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">{description}</p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Conversion Settings
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">Quality Preset</label>
                                    <select 
                                        value={quality} 
                                        onChange={(e) => setQuality(e.target.value as any)}
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none"
                                    >
                                        <option value="standard">Standard Quality (Recommended)</option>
                                        <option value="high">High Quality (Larger file size)</option>
                                        <option value="fast">Fast Conversion (Draft)</option>
                                    </select>
                                </div>

                                {(toolId === "pdf-to-word" || toolId === "pdf-to-excel") && (
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input type="checkbox" checked={useOcr} onChange={(e) => setUseOcr(e.target.checked)} className="text-[var(--accent)]" />
                                        <span>Enable OCR (for scanned pages)</span>
                                    </label>
                                )}
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Files in Queue</h3>
                                        <span className="text-xs text-[var(--text-faint)]">{files.length}/50</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map(f => (
                                            <div key={f._id} className="flex items-center justify-between p-2 bg-[var(--bg)] border border-[var(--border)] rounded text-xs">
                                                <span className="truncate max-w-[150px]" title={f.originalName}>{f.originalName}</span>
                                                <button onClick={() => removeFile(f._id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setFiles([])} className="mt-3 text-xs text-red-500 hover:underline w-full text-center">Clear Queue</button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-[var(--border-strong)]">
                            <Button variant="accent" className="w-full" onClick={handleConvert} disabled={processing || uploading || files.length === 0} loading={processing}>
                                {processing ? "Converting..." : "Convert Now"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Conversion Complete!</h3>
                                        <p className="text-sm opacity-90">Successfully generated {results.reduce((s, r) => s + r.converted.length, 0)} {outputLabel}(s).</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Convert More</Button>
                                        <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => r.converted.forEach((c, j) => setTimeout(() => window.open(fileAPI.getDownloadUrl(c), "_blank"), (i * 300) + (j * 100))))}>
                                            Download All
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-sm font-semibold mb-4 text-[var(--text)]">Generated Files</h3>
                                <div className="space-y-4">
                                    {results.map((res, i) => (
                                        <div key={i} className="border border-[var(--border-strong)] rounded bg-[var(--bg-elevated)] overflow-hidden">
                                            <div className="p-3 bg-[var(--surface-hover)] border-b border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center justify-between">
                                                <span>Source: {res.original.originalName} ({formatSize(res.original.size)})</span>
                                                <span>{res.converted.length} file(s) generated</span>
                                            </div>
                                            <div className="p-3 space-y-2">
                                                {res.converted.map((c, j) => (
                                                    <div key={j} className="flex items-center justify-between gap-4 p-2 bg-[var(--bg)] border border-[var(--border)] rounded">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0">{getIcon()}</div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-[var(--text)] truncate">{c.filename}</p>
                                                                <p className="text-xs text-[var(--text-faint)] mt-1">{outputLabel} • {formatSize(c.size)}</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--accent)] shrink-0" onClick={() => window.open(fileAPI.getDownloadUrl(c), "_blank")}><Download size={16} /> Download</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6">
                                <PdfUploadDropzone maxFiles={50} loading={uploading} title={`Upload files`} description={`Drop up to 50 ${acceptedFiles} files here to convert them to ${outputLabel}.`} onFilesSelected={handleFilesSelected} />
                                
                                {files.length === 0 && (
                                    <div className="mt-12 text-center text-[var(--text-muted)]">
                                        <div className="opacity-20 flex justify-center mb-4">{getIcon()}</div>
                                        <p className="text-sm">Your converted {outputLabel} files will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName={title} toolDescription={description} />
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
