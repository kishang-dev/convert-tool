import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, Unlock, Download, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { fileAPI, FileData } from '@/lib/api';
import Head from 'next/head';

export default function PdfUnlock() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [unlockedFile, setUnlockedFile] = useState<FileData | null>(null);
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
            setUnlockedFile(null);
            setPassword('');
        }
    };

    const handleUnlock = async () => {
        if (!file) return;
        if (!password) {
            showToast('Password is required to unlock this PDF', 'error');
            return;
        }

        setLoading(true);
        try {
            // Step 1: Upload the file
            const uploadRes = await fileAPI.uploadFiles([file]);
            const uploadedFile = uploadRes.files[0];
            
            // Step 2: Request backend to unlock it
            const response = await fileAPI.unlockPDF(uploadedFile._id, password);
            setUnlockedFile(response.file);
            showToast('PDF unlocked and password removed successfully!', 'success');
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Failed to unlock PDF. Please verify your password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (unlockedFile) {
            window.open(fileAPI.getDownloadUrl(unlockedFile.filename), '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>PDF Unlock & Password Remover | QuickPDF Tools</title>
                <meta name="description" content="Unlock password protected PDFs and permanently remove passwords and restrictions." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="gradient-text">PDF Unlock & Password Remover</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Remove encryption, restrictions, and passwords from protected PDF files in seconds.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Unlock size={120} className="text-white" />
                        </div>
                        
                        {!unlockedFile ? (
                            <div className="flex flex-col items-center gap-6 relative z-10">
                                <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-2">
                                    {file ? (
                                        <Unlock size={40} className="text-yellow-400 animate-pulse" />
                                    ) : (
                                        <Upload size={40} className="text-yellow-400" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="w-full max-w-md text-center space-y-6">
                                        <div>
                                            <p className="text-xl font-semibold mb-1 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Protected PDF</p>
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                                                <ShieldAlert size={16} className="text-yellow-500" />
                                                Enter PDF Password
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter document open password"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-yellow-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder-gray-500"
                                                autoFocus
                                            />
                                        </div>

                                        <div className="flex gap-4 justify-center mt-8">
                                            <Button variant="ghost" onClick={() => setFile(null)}>
                                                Change File
                                            </Button>
                                            <Button 
                                                onClick={handleUnlock} 
                                                loading={loading}
                                                className="bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold"
                                            >
                                                Unlock PDF
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-semibold mb-2">Upload Protected PDF</p>
                                        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                                            Choose an encrypted PDF file to remove its protection and passwords
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
                            <div className="flex flex-col items-center gap-6 animate-fadeIn relative z-10">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle size={40} className="text-green-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold mb-2">PDF Unlocked successfully!</p>
                                    <p className="text-sm text-gray-400 mb-8">All password protection and editing restrictions have been permanently removed.</p>
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="ghost" onClick={() => { setFile(null); setUnlockedFile(null); setPassword(''); }}>
                                            Unlock Another
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
