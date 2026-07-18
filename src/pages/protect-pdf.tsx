import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileText as FileText, LuTrash2 as Trash2, LuDownload as Download, LuLock as Lock, LuCheck as Check, LuEye as Eye, LuEyeOff as EyeOff, LuRefreshCw as RefreshCw } from "react-icons/lu";
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

export default function ProtectPdf() {
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

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0, n = charset.length; i < 16; ++i) {
            newPassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setPassword(newPassword);
        setShowPassword(true);
    };

    const getPasswordStrength = () => {
        if (!password) return { label: "", color: "transparent", width: "0%" };
        if (password.length < 6) return { label: "Weak", color: "bg-red-500", width: "33%" };
        if (password.length < 10 || !/[!@#$%^&*]/.test(password)) return { label: "Good", color: "bg-yellow-500", width: "66%" };
        return { label: "Strong", color: "bg-green-500", width: "100%" };
    };

    const handleProtect = async () => {
        if (files.length === 0) return;
        if (!password) {
            showToast("Please enter a password.", "error");
            return;
        }

        setProcessing(true);
        setResults([]);
        try {
            const protectPromises = files.map(async (file) => {
                const response = await fileAPI.protectPDF(file._id, password);
                return response.file;
            });

            const processed = await Promise.all(protectPromises);
            setResults(processed);
            showToast(`Successfully protected ${processed.length} file(s).`);
            
            gtag.event({ action: "use_tool", category: "Tool", label: "protect-pdf" });
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Protection failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const strength = getPasswordStrength();
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Protect PDF",
        description: "Secure your PDFs with military-grade encryption and password protection.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/protect-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Protect PDF" description="Add strong password protection to your PDF files. Secure sensitive documents instantly." canonical="/protect-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Protect PDF', href: '/protect-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Protect PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Encrypt your PDF documents with a secure password. Prevent unauthorized access and protect sensitive information.
                    </p>
                </div>

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)]">Security Settings</h3>
                            
                            <div className="mb-6 relative">
                                <label className="block text-sm font-medium mb-2">Set Password</label>
                                <div className="relative flex items-center">
                                    <Lock size={16} className="absolute left-3 text-[var(--text-faint)]" />
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
                                
                                {password && (
                                    <div className="mt-2 flex items-center gap-2 animate-fadeIn">
                                        <div className="h-1 flex-1 bg-[var(--border)] rounded overflow-hidden">
                                            <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                                    </div>
                                )}

                                <button onClick={generatePassword} className="mt-3 flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline">
                                    <RefreshCw size={12} /> Generate strong password
                                </button>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 border-t border-[var(--border)] pt-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium">Files to Protect</h3>
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
                            <Button variant="accent" className="w-full flex items-center justify-center gap-2" onClick={handleProtect} disabled={processing || uploading || files.length === 0 || !password} loading={processing}>
                                {processing ? "Encrypting..." : <><Lock size={16} /> Protect PDF</>}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {results.length > 0 ? (
                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Check size={24} /> Protected!</h3>
                                        <p className="text-sm opacity-90">Your files are now securely encrypted with your password.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setResults([])}>Protect More</Button>
                                        {results.length > 1 && (
                                            <Button size="sm" variant="accent" onClick={() => results.forEach((r, i) => setTimeout(() => window.open(fileAPI.getDownloadUrl(r), "_blank"), i * 300))}>Download All</Button>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--bg-elevated)] border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg mb-6 text-sm flex items-start gap-3">
                                    <Lock className="shrink-0 mt-0.5" />
                                    <p><strong>Important:</strong> Keep your password safe. If you forget it, there is no way to recover your protected document!</p>
                                </div>

                                <div className="space-y-3">
                                    {results.map((res, i) => (
                                        <div key={i} className="p-4 border border-[var(--border-strong)] rounded bg-[var(--bg-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded shrink-0"><Lock size={20}/></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-[var(--text)] truncate">{res.filename}</p>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">Encrypted PDF</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-[var(--text-muted)] hover:text-[var(--accent)] shrink-0" onClick={() => window.open(fileAPI.getDownloadUrl(res), "_blank")}><Download size={16} /> Download</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 p-6">
                                <PdfUploadDropzone maxFiles={50} loading={uploading} title="Upload PDFs" description="Drop up to 50 PDF files here to encrypt them all at once." onFilesSelected={handleFilesSelected} />
                                
                                {files.length === 0 && (
                                    <div className="mt-12 text-center text-[var(--text-muted)]">
                                        <Lock size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="text-sm">Upload files and set a password to begin.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="Protect PDF" toolDescription="Batch protect multiple PDFs with strong encryption. Secure your sensitive data." />
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
