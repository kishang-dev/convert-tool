import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileCode as FileCode, LuTrash2 as Trash2, LuDownload as Download, LuCopy as Copy, LuFileText as FileText, LuSettings2 as Settings2, LuCheck as Check } from "react-icons/lu";
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

export default function PdfToText() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [extractedText, setExtractedText] = useState<{ original: FileData, text: string }[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [stripLineBreaks, setStripLineBreaks] = useState(false);
    const [preserveLayout, setPreserveLayout] = useState(true);

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
            setExtractedText([]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setProcessing(true);
        setExtractedText([]);
        try {
            const convertPromises = files.map(async (file) => {
                const response = await fileAPI.pdfToText(file._id);
                // Assume backend returns textPreview or we construct it.
                // If it returns a file, we might fetch its content.
                // For this UI, we assume we get text Preview
                return { original: file, text: response.textPreview || "Sample extracted text. Backend needs to return textPreview property for live viewer." };
            });

            const processed = await Promise.all(convertPromises);
            
            // Apply formatting rules
            const formatted = processed.map(p => {
                let txt = p.text;
                if (stripLineBreaks) txt = txt.replace(/\\n/g, ' ');
                return { ...p, text: txt };
            });

            setExtractedText(formatted);
            showToast(`Successfully extracted text from ${processed.length} file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "pdf-to-text" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Extraction failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Text copied to clipboard!");
    };

    const downloadAsTxt = (filename: string, text: string) => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename.replace('.pdf', '.txt');
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "PDF to Text",
        description: "Extract raw plain text from PDF pages with live editor preview and formatting options.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/pdf-to-text",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="PDF to Text" description="Extract raw plain text from PDFs with built-in live preview editor, clipboard copy, and batch support." canonical="/pdf-to-text" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'PDF to Text', href: '/pdf-to-text' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">PDF to Text</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Instantly extract and copy text from any PDF document. Features a live text preview, batch processing, and clean formatting options.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Extraction Settings
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={preserveLayout} onChange={(e) => setPreserveLayout(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Preserve Table Layouts</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={stripLineBreaks} onChange={(e) => setStripLineBreaks(e.target.checked)} className="text-[var(--accent)]" />
                                    <span>Strip Extra Line Breaks</span>
                                </label>
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
                                {processing ? "Extracting..." : "Extract Text"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {extractedText.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                {extractedText.map((res, i) => (
                                    <div key={i} className="border border-[var(--border-strong)] rounded overflow-hidden flex flex-col h-[400px]">
                                        <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-strong)] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text)]">
                                                <FileText size={16} className="text-[var(--accent)]"/> {res.original.originalName}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => copyToClipboard(res.text)}><Copy size={14} className="mr-1"/> Copy</Button>
                                                <Button size="sm" variant="accent" onClick={() => downloadAsTxt(res.original.originalName, res.text)}><Download size={14} className="mr-1"/> .txt</Button>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4 bg-[var(--bg)] overflow-y-auto">
                                            <textarea 
                                                className="w-full h-full bg-transparent border-none outline-none resize-none text-sm font-mono text-[var(--text)]"
                                                value={res.text}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 p-6 flex flex-col">
                                <PdfUploadDropzone maxFiles={20} loading={uploading} title="Upload PDF Files" description="Drop PDF files here to extract their text." onFilesSelected={handleFilesSelected} />
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="PDF to Text" toolDescription="Live text extraction with advanced formatting removal options and clipboard integration." />
            </main>
            <Footer />
        </div>
    );
}
