import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, FileText, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { fileAPI, FileData } from '@/lib/api';
import Head from 'next/head';
import * as gtag from '@/lib/gtag';

export default function PdfToPptx() {
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
            if (selectedFile.type !== 'application/pdf') {
                showToast('Please select a PDF file', 'error');
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
            label: 'pdf-to-pptx'
        });
        if (!file) return;

        setLoading(true);
        try {
            // Upload first
            const uploadRes = await fileAPI.uploadFiles([file]);
            const uploadedFile = uploadRes.files[0];

            // Convert
            const response = await fileAPI.pdfToPptx(uploadedFile._id);
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

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <Head>
                <title>PDF to PowerPoint Converter | ToolBasket Tools</title>
                <meta name="description" content="Convert PDF documents to PowerPoint presentations easily." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">PDF to PowerPoint</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Convert your PDF documents to editable PowerPoint presentations.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileText size={40} className="text-purple-400" />
                                    ) : (
                                        <Upload size={40} className="text-purple-400" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="text-center">
                                        <p className="text-xl font-medium mb-2">{file.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <div className="flex gap-4 justify-center">
                                            <Button variant="ghost" onClick={() => setFile(null)}>
                                                Change File
                                            </Button>
                                            <Button onClick={handleConvert} loading={loading}>
                                                Convert to PPTX
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-medium mb-2">Upload PDF File</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            Select a PDF file to convert to PowerPoint
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
                            <div className="flex flex-col items-center gap-6 animate-fadeIn">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={40} className="text-green-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-2">Conversion Complete!</p>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        Your file has been successfully converted to PowerPoint.
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="ghost" onClick={() => { setFile(null); setConvertedFile(null); }}>
                                            Convert Another
                                        </Button>
                                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                            Download PPTX
                                            <Download size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">High Quality</h3>
                            <p>Preserves layout and formatting in the slides.</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Fast Conversion</h3>
                            <p>Process your files in seconds.</p>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Secure</h3>
                            <p>Files are automatically deleted after 1 hour.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
