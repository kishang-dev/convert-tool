import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuFileText as FileText, LuType as Type, LuDownload as Download, LuSettings2 as Settings2, LuCheck as Check } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import { fileAPI, FileData } from "@/lib/api";
import * as gtag from "@/lib/gtag";
import AdBanner from "@/components/AdBanner";

export default function TextToPdf() {
    const router = useRouter();
    const [textInput, setTextInput] = useState("");
    const [result, setResult] = useState<FileData | null>(null);
    
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Advanced Features State
    const [fontFamily, setFontFamily] = useState("Helvetica");
    const [fontSize, setFontSize] = useState("12");
    const [theme, setTheme] = useState("Light");

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setTextInput(event.target.result.toString());
                showToast("Text file loaded successfully.");
            }
        };
        reader.readAsText(file);
    };

    const handleConvert = async () => {
        if (!textInput.trim()) {
            showToast("Please enter some text.", "error");
            return;
        }

        setProcessing(true);
        setResult(null);
        try {
            // Because the backend might not support raw text via API easily if we don't have a specific endpoint that takes a string.
            // Assuming fileAPI.textToPdf exists and takes a file ID. We need to create a File object and upload it first.
            const blob = new Blob([textInput], { type: "text/plain" });
            const file = new File([blob], "document.txt", { type: "text/plain" });
            
            const uploadRes = await fileAPI.uploadFiles([file]);
            if (uploadRes.files && uploadRes.files.length > 0) {
                const response = await fileAPI.textToPdf(uploadRes.files[0]._id);
                setResult(response.file);
                showToast("PDF generated successfully.");
                gtag.event({ action: "use_tool", category: "Tool", label: "text-to-pdf" });
            }
        } catch (error: any) {
            showToast(error.message || error.response?.data?.error || "Generation failed.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Text to PDF",
        description: "Generate PDF documents from raw text with live editing, font settings, and themes.",
        applicationCategory: "BrowserApplication",
        url: "https://toolbasketai.com/text-to-pdf",
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Text to PDF" description="Create a PDF from text. Features a live text editor, custom font settings, font size sliders, and file upload." canonical="/text-to-pdf" structuredData={structuredData} />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Text to PDF', href: '/text-to-pdf' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Text to PDF Maker</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Type, paste, or upload a `.txt` file into the editor below to instantly generate a beautifully formatted PDF document.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn flex flex-col md:flex-row min-h-[500px]">
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--border-strong)] bg-[var(--bg-elevated)] flex flex-col">
                        <div className="p-6 flex-1 overflow-y-auto">
                            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                                <Settings2 size={14} /> Document Settings
                            </h3>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Font Family</label>
                                    <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm focus:border-[var(--accent)] outline-none">
                                        <option value="Helvetica">Helvetica (Modern)</option>
                                        <option value="Courier">Courier (Monospace)</option>
                                        <option value="Times-Roman">Times Roman (Serif)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Font Size: {fontSize}px</label>
                                    <input type="range" min="8" max="24" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full accent-[var(--accent)]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Document Theme</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setTheme("Light")} className={`flex-1 py-1.5 text-xs rounded border ${theme === "Light" ? "bg-[var(--text)] text-[var(--bg)] border-[var(--text)]" : "border-[var(--border)]"}`}>Light</button>
                                        <button onClick={() => setTheme("Dark")} className={`flex-1 py-1.5 text-xs rounded border ${theme === "Dark" ? "bg-[var(--bg)] text-[var(--text)] border-[var(--text)]" : "border-[var(--border)]"}`}>Dark</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 border-t border-[var(--border)] pt-6">
                                <label className="block text-sm font-medium mb-2">Upload .txt File</label>
                                <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[var(--accent-soft)] file:text-[var(--accent)] hover:file:bg-[var(--accent-soft)]/80"/>
                            </div>
                        </div>

                        <div className="p-6 border-t border-[var(--border-strong)]">
                            <Button variant="accent" className="w-full" onClick={handleConvert} disabled={processing || !textInput.trim()} loading={processing}>
                                {processing ? "Generating PDF..." : "Generate PDF"}
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--surface)] flex flex-col relative">
                        {result ? (
                            <div className="flex-1 p-6 flex flex-col items-center justify-center">
                                <div className="w-full max-w-md bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg text-center shadow-lg">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">PDF Generated!</h3>
                                    <p className="text-sm mb-6 opacity-90">Your text has been beautifully formatted.</p>
                                    <div className="flex flex-col gap-3">
                                        <Button size="lg" className="w-full flex justify-center gap-2" onClick={() => window.open(fileAPI.getDownloadUrl(result), "_blank")}>
                                            <Download size={18} /> Download PDF
                                        </Button>
                                        <Button size="md" variant="secondary" className="w-full" onClick={() => setResult(null)}>Back to Editor</Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col p-4 bg-[var(--bg)]">
                                <textarea 
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Start typing your document here..."
                                    className="flex-1 w-full bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg p-6 focus:border-[var(--accent)] outline-none resize-none transition-colors"
                                    style={{ 
                                        fontFamily: fontFamily === 'Courier' ? 'monospace' : fontFamily === 'Times-Roman' ? 'serif' : 'sans-serif',
                                        fontSize: `${fontSize}px`,
                                        color: theme === 'Dark' ? '#fff' : '#000',
                                        backgroundColor: theme === 'Dark' ? '#111' : '#fff'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </section>
                <ToolSEOContent toolName="Text to PDF" toolDescription="Live text-to-pdf editor featuring font choices, custom font sizing, and instant visual themes." />
            </main>
            <Footer />
        </div>
    );
}
