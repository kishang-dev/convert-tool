import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, FileCode, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { fileAPI, FileData } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function HtmlToPdf() {
    const [file, setFile] = useState<File | null>(null);
    const [convertedFile, setConvertedFile] = useState<FileData | null>(null);
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
            if (!selectedFile.name.match(/\.(html|htm)$/)) {
                showToast('Please select an HTML file', 'error');
                return;
            }
            setFile(selectedFile);
            setConvertedFile(null);
        }
    };

    const handleConvert = async () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'html-to-pdf'
        });
        if (!file) return;

        setLoading(true);
        try {
            const uploadRes = await fileAPI.uploadFiles([file]);
            const uploadedFile = uploadRes.files[0];
            const response = await fileAPI.htmlToPdf(uploadedFile._id);
            setConvertedFile(response.file);
            showToast('Conversion successful!', 'success');
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Conversion failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (convertedFile) {
            window.open(fileAPI.getDownloadUrl(convertedFile.filename), '_blank');
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "HTML to PDF Converter Tools",
        "description": "Convert HTML files to PDF documents.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/html-to-pdf`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-[var(--text)] dark:text-[var(--text)]">
            <SEO 
                title="HTML to PDF Converter Tools" 
                description="Convert HTML files to PDF documents." 
                canonical="/html-to-pdf"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">HTML to PDF</span>
                    </h1>
                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-lg">
                        Convert your HTML files to PDF documents.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-blue-500/10 rounded flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileCode size={40} className="text-blue-400" />
                                    ) : (
                                        <Upload size={40} className="text-blue-400" />
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
                                                Convert to PDF
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-medium mb-2">Upload HTML File</p>
                                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-6">
                                            Select an .html file to convert
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                            Choose File
                                        </Button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".html, .htm"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-6 animate-fadeIn">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={40} className="text-green-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-2">Conversion Complete!</p>
                                    <div className="flex gap-4 justify-center mt-6">
                                        <Button variant="ghost" onClick={() => { setFile(null); setConvertedFile(null); }}>
                                            Convert Another
                                        </Button>
                                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                            Download PDF
                                            <Download size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        
            <ToolSEOContent toolName="HTML to PDF Converter Tools" toolDescription="Convert HTML files to PDF documents." />
        </div>
    );
}
