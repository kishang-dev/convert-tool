import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, FileText, Download, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { fileAPI, FileData } from '@/lib/api';
import Head from 'next/head';

export default function PptToPdf() {
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
            if (!selectedFile.name.match(/\.(pptx|ppt)$/)) {
                showToast('Please select a PowerPoint file', 'error');
                return;
            }
            setFile(selectedFile);
            setConvertedFile(null);
        }
    };

    const handleConvert = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const uploadRes = await fileAPI.uploadFiles([file]);
            const uploadedFile = uploadRes.files[0];
            const response = await fileAPI.pptToPdf(uploadedFile._id);
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
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>PowerPoint to PDF Converter | QuickPDF Tools</title>
                <meta name="description" content="Convert PowerPoint presentations to PDF documents." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">PowerPoint to PDF</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Convert your presentations to PDF.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20 text-yellow-200 text-sm">
                        <AlertTriangle size={16} />
                        Note: This feature requires LibreOffice on the server for best results.
                    </div>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileText size={40} className="text-orange-400" />
                                    ) : (
                                        <Upload size={40} className="text-orange-400" />
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
                                        <p className="text-xl font-medium mb-2">Upload PowerPoint File</p>
                                        <p className="text-sm text-gray-400 mb-6">
                                            Select a .pptx or .ppt file to convert
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                            Choose File
                                        </Button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pptx, .ppt"
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
        </div>
    );
}
