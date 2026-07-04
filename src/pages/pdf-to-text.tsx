import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, FileText, Download, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { fileAPI, FileData } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function PdfToText() {
    const [file, setFile] = useState<File | null>(null);
    const [convertedFile, setConvertedFile] = useState<FileData | null>(null);
    const [textPreview, setTextPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                showToast('Please select a PDF file', 'error');
                return;
            }
            setFile(selectedFile);
            setConvertedFile(null);
            setTextPreview('');
        }
    };

    const handleConvert = async () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'pdf-to-text'
        });
        if (!file) return;

        setLoading(true);
        try {
            const uploadRes = await fileAPI.uploadFiles([file]);
            const uploadedFile = uploadRes.files[0];
            const response = await fileAPI.pdfToText(uploadedFile._id);
            setConvertedFile(response.file);
            setTextPreview(response.textPreview || '');
            showToast('Extraction successful!', 'success');
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Extraction failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (convertedFile) {
            window.open(fileAPI.getDownloadUrl(convertedFile.filename), '_blank');
        }
    };

    const handleCopyText = () => {
        if (textPreview) {
            navigator.clipboard.writeText(textPreview);
            showToast('Text copied to clipboard', 'success');
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "PDF to Text Converter Tools",
        "description": "Extract plain text from PDF documents.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/pdf-to-text`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-[var(--text)] dark:text-[var(--text)]">
            <SEO 
                title="PDF to Text Converter Tools" 
                description="Extract plain text from PDF documents." 
                canonical="/pdf-to-text"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">PDF to Text</span>
                    </h1>
                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-lg">
                        Extract text from your PDF documents.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-[var(--surface-hover)] rounded flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileText size={40} className="text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                                    ) : (
                                        <Upload size={40} className="text-[var(--text-muted)] dark:text-[var(--text-muted)]" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="text-center">
                                        <p className="text-xl font-medium mb-2">{file.name}</p>
                                        <div className="flex gap-4 justify-center mt-6">
                                            <Button variant="ghost" onClick={() => setFile(null)}>
                                                Change File
                                            </Button>
                                            <Button onClick={handleConvert} loading={loading}>
                                                Extract Text
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-medium mb-2">Upload PDF File</p>
                                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-6">
                                            Select a PDF file to extract text from
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                            Choose File
                                        </Button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 animate-fadeIn w-full">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={40} className="text-green-400" />
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-2xl font-bold mb-2">Extraction Complete!</p>

                                    {textPreview && (
                                        <div className="bg-black/30 p-4 rounded text-left text-[var(--text-muted)] dark:text-[var(--text-muted)] font-mono text-sm max-h-60 overflow-y-auto mb-6 w-full relative group">
                                            <button
                                                onClick={handleCopyText}
                                                className="absolute top-2 right-2 p-2 bg-[var(--surface-hover)] rounded hover:bg-[var(--surface-hover)] transition-colors opacity-0 group-hover:opacity-100"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <pre className="whitespace-pre-wrap">{textPreview}...</pre>
                                        </div>
                                    )}

                                    <div className="flex gap-4 justify-center mt-6">
                                        <Button variant="ghost" onClick={() => { setFile(null); setConvertedFile(null); setTextPreview(''); }}>
                                            Convert Another
                                        </Button>
                                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                            Download .txt
                                            <Download size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        
            <ToolSEOContent toolName="PDF to Text Converter Tools" toolDescription="Extract plain text from PDF documents." />
            <Footer />
        </div>
    );
}
