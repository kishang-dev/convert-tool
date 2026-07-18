import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileText as FileText, LuTrash2 as Trash2, LuDownload as Download, LuKey as Unlock, LuCheck as Check, LuEye as Eye, LuEyeOff as EyeOff } from "react-icons/lu";
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

export default function UnlockPdf() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [results, setResults] = useState<FileData[]>([]);
    
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

    const removeFile = (id: string) => setFiles(files.filter(f => f._id !== id));

    const handleUnlock = async () => {
        if (files.length === 0) return;
        if (!password) {
            showToast("Please enter the password to unlock.", "error");
            return;
        }

        setProcessing(true);
        setResults([]);
        try {
            const unlockPromises = files.map(async (file) => {
                const response = await fileAPI.unlockPDF(file._id, password);
                return response.file;
            });

            const processed = await Promise.all(unlockPromises);
            setResults(processed);
            showToast(`Successfully unlocked ${processed.length} file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "pdf-unlock" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Unlock failed. Password might be incorrect.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Unlock PDF",
        description: "Remove passwords from secure PDFs and strip encryption instantly.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/pdf-unlock",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Unlock PDF" description="Decrypt password protected PDFs and strip passwords in bulk easily." canonical="/pdf-unlock" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Unlock PDF', href: '/pdf-unlock' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Unlock PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Remove password security from your PDFs in bulk. Enter the password once and strip the protection from all uploaded files forever.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Decryption Key</h3>
                            
                            <div className="mb-6 relative">
                                <label className="block text-sm font-medium mb-2">Current Password</label>
                                <div className="relative flex items-center">
                                    <Unlock size={16} className="absolute left-3 text-[var(--text-faint)]" />
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Type password..." 
                                        className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded pl-9 pr-10 py-2 text-sm focus:border-[var(--accent)] outline-none"
                                    />
                                    <button 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 text-[var(--text-muted)] hover:text-[var(--text)]"
                                    >
                                        {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                                    </button>
                                </div>
                                <p className="text-xs text-[var(--text-faint)] mt-2">
                                    This password will be used to attempt decryption on all uploaded files.
                                </p>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Locked Files</h3>
                                        <span className="text-xs text-[var(--text-faint)]">{files.length}</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map(f => (
                                            <div key={f._id} className="flex items-center justify-between p-2 bg-[var(--bg)] border border-[var(--border)] rounded text-xs">
                                                <span className="truncate max-w-[150px]">{f.originalName}</span>
                                                <button onClick={() => removeFile(f._id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-[var(--border-strong)]">
                            <Button variant="accent" className="w-full flex items-center justify-center gap-2" onClick={handleUnlock} disabled={processing || uploading || files.length === 0 || !password} loading={processing}>
                                {processing ? "Decrypting..." : <><Unlock size={16} /> Unlock PDFs</>}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Unlocked Successfully!</h3>
                                        <p className="text-sm opacity-90">Your files are now completely stripped of password protection.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Unlock More</Button>
                                        {results.length > 1 && (
                                            <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r), "_blank"), i * 300))}>Download All</Button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {results.map((res, i) => (
                                        <div key={i} className="p-4 border border-[var(--border-strong)] rounded bg-[var(--bg-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><Unlock size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">Protection Removed</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--accent)] shrink-0" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6">
                                <PdfUploadDropzone maxFiles={50} loading={uploading} title="Upload Protected PDFs" description="Drop up to 50 password-protected PDF files here." onFilesSelected={handleFilesSelected} />
                                
                                {files.length === 0 && (
                                    <div className="mt-12 text-center text-[var(--text-muted)]">
                                        <Unlock size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-sm">Upload locked files and enter the password to unlock them.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="Unlock PDF" toolDescription="Batch remove password protection from up to 50 PDFs instantly." />
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
