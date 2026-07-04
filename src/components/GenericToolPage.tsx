import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { fileAPI, FileData } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FileList from "@/components/FileList";
import { Upload, ArrowLeft } from "lucide-react";
import * as gtag from "@/lib/gtag";
import SEO from "@/components/SEO";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import Toast from "./Toast";

const TOOL_CONFIGS: Record<string, { title: string, description: string, minFiles: number, maxFiles: number, run: (files: FileData[], password?: string) => Promise<any>, needsPassword?: boolean, accepts: string, openEditor?: boolean }> = {
    "editor": {
        title: "Advanced PDF Editor",
        description: "Annotate, draw, rotate, delete, and modify text on your PDF pages visually.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        openEditor: true,
        run: async (files) => ({ file: files[0] })
    },
    "merge-pdf": {
        title: "Merge PDF",
        description: "Combine multiple PDF documents into a single file.",
        minFiles: 2,
        maxFiles: 50,
        accepts: ".pdf",
        run: async (files) => await fileAPI.mergePDFs(files.map(f => f._id))
    },
    "split-pdf": {
        title: "Split PDF",
        description: "Separate pages from a PDF or save each page individually.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.splitPDF(files[0]._id)
    },
    "compress-pdf": {
        title: "Compress PDF",
        description: "Reduce the file size of your PDF documents.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.compressPDF(files[0]._id)
    },
    "protect-pdf": {
        title: "Protect PDF",
        description: "Encrypt and secure your PDFs with a custom password.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        needsPassword: true,
        run: async (files, password) => await fileAPI.protectPDF(files[0]._id, password!)
    },
    "rotate-pdf": {
        title: "Rotate PDF",
        description: "Rotate PDF pages clockwise or counter-clockwise.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.rotatePDF(files[0]._id)
    },
    "pdf-to-image": {
        title: "PDF to Image",
        description: "Extract pages from your PDF as high-resolution images.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.convertToImage(files[0]._id)
    },
    "pdf-to-word": {
        title: "PDF to Word",
        description: "Convert PDF documents to editable Microsoft Word files.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.convertToWord(files[0]._id)
    },
    "word-to-pdf": {
        title: "Word to PDF",
        description: "Transform .docx files into standard PDF format.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".doc,.docx",
        run: async (files) => await fileAPI.wordToPdf(files[0]._id)
    },
    "pdf-to-excel": {
        title: "PDF to Excel",
        description: "Extract tabular data from PDFs to spreadsheets.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.convertToExcel(files[0]._id)
    },
    "ppt-to-pdf": {
        title: "PowerPoint to PDF",
        description: "Convert presentation slides into PDF pages.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".ppt,.pptx",
        run: async (files) => await fileAPI.pptToPdf(files[0]._id)
    },
    "text-to-pdf": {
        title: "Text to PDF",
        description: "Generate a formatted PDF document from raw text input.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".txt",
        run: async (files) => await fileAPI.textToPdf(files[0]._id)
    },
    "csv-to-pdf": {
        title: "CSV to PDF",
        description: "Transform spreadsheet CSV files into organized PDF pages.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".csv",
        run: async (files) => await fileAPI.csvToPdf(files[0]._id)
    },
    "pdf-to-csv": {
        title: "PDF to CSV",
        description: "Extract tables and rows from PDFs into CSV format.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.pdfToCsv(files[0]._id)
    },
    "pdf-to-speech": {
        title: "PDF to Speech",
        description: "Convert document text into high-fidelity audible voiceovers.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".pdf",
        run: async (files) => await fileAPI.pdfToSpeech(files[0]._id)
    },
    "video-to-pdf": {
        title: "Video to PDF Notes",
        description: "Extract slide transitions from video files to study notes.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".mp4,.avi,.mov,.mkv",
        run: async (files) => await fileAPI.videoToPdf(files[0]._id)
    },
    "audio-to-transcript": {
        title: "Audio to Transcript",
        description: "Generate textual transcriptions from voice records.",
        minFiles: 1,
        maxFiles: 1,
        accepts: ".mp3,.wav,.ogg,.m4a",
        run: async (files) => await fileAPI.audioToPdf(files[0]._id)
    },
    "to-jpg": {
        title: "Convert to JPG",
        description: "Convert uploaded files into standard JPEG image records.",
        minFiles: 1,
        maxFiles: 10,
        accepts: ".png,.webp,.heic,.jpeg",
        run: async (files) => {
            const results = [];
            for (const file of files) {
                results.push(await fileAPI.imageConvert(file._id, "jpg"));
            }
            return { file: results[0].file, files: results.map(r => r.file) };
        }
    },
    "to-png": {
        title: "Convert to PNG",
        description: "Convert documents to lossless transparent portable network graphics.",
        minFiles: 1,
        maxFiles: 10,
        accepts: ".jpg,.jpeg,.webp,.heic",
        run: async (files) => {
            const results = [];
            for (const file of files) {
                results.push(await fileAPI.imageConvert(file._id, "png"));
            }
            return { file: results[0].file, files: results.map(r => r.file) };
        }
    }
};

export default function GenericToolPage({ id, canonicalPath }: { id: string; canonicalPath?: string }) {
    const router = useRouter();

    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [password, setPassword] = useState("");

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const tool = typeof id === "string" ? TOOL_CONFIGS[id] : null;
    const pagePath = canonicalPath || `/${id}`;

    useEffect(() => {
        // Clear files when switching tools
        setFiles([]);
        setPassword("");
    }, [id]);

    if (!tool) {
        return (
            <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-semibold mb-4">Tool Not Found</h1>
                <Button onClick={() => router.push("/tools")}>Back to Tools</Button>
            </div>
        );
    }

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        await handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            await handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = async (newFiles: File[]) => {
        if (newFiles.length === 0) return;

        // Check limits
        if (files.length + newFiles.length > tool.maxFiles) {
            showToast(`You can only upload up to ${tool.maxFiles} file(s) for this tool.`, "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.uploadFiles(newFiles);
            setFiles(prev => [...prev, ...response.files]);
            showToast(`${newFiles.length} file(s) uploaded successfully!`, "success");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveFile = async (fileId: string) => {
        try {
            await fileAPI.hideFile(fileId);
            setFiles(files.filter(f => f._id !== fileId));
        } catch (error) {
            console.error("Failed to remove file", error);
        }
    };

    const runTool = async () => {
        if (files.length < tool.minFiles) {
            showToast(`Please upload at least ${tool.minFiles} file(s) to proceed.`, "error");
            return;
        }
        if (tool.needsPassword && !password) {
            showToast("Password is required for this operation.", "error");
            return;
        }

        setProcessing(true);
        try {
            const response = await tool.run(files, password);
            showToast("Operation completed successfully!", "success");

            // Track tool usage event
            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: id as string,
            });

            if (tool.openEditor && response.file?._id) {
                router.push(`/editor/${response.file._id}`);
                return;
            }

            // Automatically download the result
            if (response.file) {
                window.open(fileAPI.getDownloadUrl(response.file), "_blank");
            } else if (response.files && response.files.length > 0) {
                // If it returns multiple files, just download the first one or prompt
                window.open(fileAPI.getDownloadUrl(response.files[0]), "_blank");
            }

            // Optionally clear files after success
            setFiles([]);
            setPassword("");
        } catch (error: any) {
            showToast(error.response?.data?.error || "Operation failed. Please try again.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.title,
        "description": tool.description,
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com${pagePath}`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title={tool.title}
                description={tool.description}
                canonical={pagePath}
                structuredData={structuredData}
            />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-24 md:py-28">
                <Breadcrumbs 
                    items={[
                        { label: 'All Tools', href: '/tools' },
                        { label: tool.title, href: pagePath }
                    ]} 
                />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] dark:text-[var(--text)] mb-2">{tool.title}</h1>
                    <p className="text-[var(--text-muted)] text-sm">{tool.description}</p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                    {/* Upload Section */}
                    {files.length < tool.maxFiles && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`p-12 border-b border-[var(--border-strong)] dark:border-[var(--border)] text-center transition-all cursor-pointer ${isDragging ? "bg-[var(--surface)] dark:bg-[var(--accent-soft)] border-dashed border-2 border-[#444]" : "hover:bg-[var(--surface)] dark:bg-[var(--bg-elevated)]"
                                }`}
                            onClick={() => !loading && fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border-strong)] p-4 rounded inline-block">
                                    <Upload className="text-[var(--text)] dark:text-[var(--text)]" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-[var(--text)] dark:text-[var(--text)] font-medium mb-1">Click to upload or drag & drop</h2>
                                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm">
                                        {tool.accepts.toUpperCase().replace(/\./g, '').replace(/,/g, ', ')} &mdash; Max {tool.maxFiles} file{tool.maxFiles > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple={tool.maxFiles > 1}
                                accept={tool.accepts}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {loading && (
                        <div className="p-6 text-center border-b border-[var(--border-strong)] dark:border-[var(--border)]">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-[var(--text-muted)]">Uploading...</p>
                        </div>
                    )}

                    {/* Uploaded Files */}
                    {files.length > 0 && (
                        <div className="border-b border-[var(--border-strong)] dark:border-[var(--border)] p-4">
                            <h3 className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] font-medium uppercase tracking-wider mb-3">Selected Files ({files.length}/{tool.maxFiles})</h3>
                            <FileList
                                files={files}
                                onRemove={handleRemoveFile}
                                onDownload={(file) => window.open(fileAPI.getDownloadUrl(file), "_blank")}
                            />
                        </div>
                    )}

                    {/* Password field for protect-pdf */}
                    {tool.needsPassword && files.length > 0 && (
                        <div className="border-b border-[var(--border-strong)] dark:border-[var(--border)] p-4">
                            <label className="block text-sm text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)] mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--surface)] dark:bg-[var(--bg-elevated)] border border-[var(--border-strong)] dark:border-[var(--border-strong)] px-4 py-2.5 rounded text-sm text-[var(--text)] dark:text-[var(--text)] placeholder-[#444] focus:border-[var(--accent)] outline-none transition-colors"
                                placeholder="Enter password to protect PDF…"
                            />
                        </div>
                    )}

                    {/* Action */}
                    <div className="p-4 flex justify-end">
                        <Button
                            variant="accent"
                            size="md"
                            onClick={runTool}
                            disabled={files.length < tool.minFiles || loading || processing}
                            loading={processing}
                            className="min-w-[160px]"
                        >
                            {processing ? "Processing…" : tool.title}
                        </Button>
                    </div>
                </section>

                <ToolSEOContent toolName={tool.title} toolDescription={tool.description} />
            </main>
            <Footer />
        </div>
    );
}
