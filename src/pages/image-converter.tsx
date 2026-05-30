import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, Download, ArrowRight, CheckCircle, FileImage, Settings, RefreshCw } from 'lucide-react';
import api, { fileAPI, FileData } from '@/lib/api';
import Head from 'next/head';

export default function ImageConverter() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [outFormat, setOutFormat] = useState<string>('image/webp');
    const [convertedFile, setConvertedFile] = useState<{ url: string; filename: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (!file) {
            setPreviewUrl('');
            setConvertedFile(null);
            return;
        }

        // HEIC files cannot be previewed natively in standard browser img tag
        if (file.name.toLowerCase().endsWith('.heic')) {
            setPreviewUrl('');
            setOutFormat('image/jpeg'); // Default output format for HEIC is JPG
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // Auto choose default format output
        if (file.type === 'image/webp') {
            setOutFormat('image/jpeg');
        } else {
            setOutFormat('image/webp');
        }

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const name = selectedFile.name.toLowerCase();
            const isHeic = name.endsWith('.heic');
            const isImg = selectedFile.type.startsWith('image/');
            
            if (!isImg && !isHeic) {
                showToast('Please select a valid image file (JPG, PNG, WEBP, or HEIC)', 'error');
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
            const isHeic = file.name.toLowerCase().endsWith('.heic');

            if (isHeic) {
                // HEIC -> JPG requires server-side parser
                // Step 1: Upload HEIC file
                const uploadRes = await fileAPI.uploadFiles([file]);
                const uploadedFile = uploadRes.files[0];

                // Step 2: Trigger HEIC conversion
                const res = await api.post('/heic-to-jpg', { fileId: uploadedFile._id });
                const backendFile: FileData = res.data.file;

                setConvertedFile({
                    url: fileAPI.getDownloadUrl(backendFile.filename),
                    filename: backendFile.originalName
                });
                showToast('HEIC converted to JPG successfully!', 'success');
            } else {
                // Client-side canvas conversion for absolute speed & security
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) throw new Error('Could not initialize canvas context');

                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const dataUrl = canvas.toDataURL(outFormat, 0.92);
                    const ext = outFormat.split('/')[1] === 'jpeg' ? 'jpg' : outFormat.split('/')[1];
                    const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                    
                    setConvertedFile({
                        url: dataUrl,
                        filename: `${baseName}.${ext}`
                    });
                    showToast('Image converted successfully!', 'success');
                };
                img.src = previewUrl;
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Conversion failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (convertedFile) {
            const link = document.createElement('a');
            link.href = convertedFile.url;
            link.download = convertedFile.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>Multi-Format Image Converter | QuickPDF Tools</title>
                <meta name="description" content="Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, and PNG to WEBP in real-time." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                        <span className="gradient-text">Image Converter</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, PNG to WEBP, and more.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12 relative overflow-hidden">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileImage size={40} className="text-indigo-400 animate-pulse" />
                                    ) : (
                                        <Upload size={40} className="text-indigo-400" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="w-full max-w-md text-center space-y-6">
                                        <div>
                                            <p className="text-xl font-semibold mb-1 truncate">{file.name}</p>
                                            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • Detected: {file.name.split('.').pop()?.toUpperCase()}</p>
                                        </div>

                                        {previewUrl && (
                                            <div className="flex justify-center p-2 bg-slate-950/40 border border-white/5 rounded-xl max-h-[200px] overflow-hidden">
                                                <img src={previewUrl} alt="Thumbnail" className="max-h-[180px] object-contain rounded-lg" />
                                            </div>
                                        )}

                                        {/* Format selector */}
                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                                                <Settings size={16} className="text-indigo-400" />
                                                Convert To:
                                            </label>
                                            <select
                                                value={outFormat}
                                                onChange={(e) => setOutFormat(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-white text-sm"
                                            >
                                                {file.name.toLowerCase().endsWith('.heic') ? (
                                                    <option value="image/jpeg" className="bg-[#0f172a]">JPEG / JPG</option>
                                                ) : (
                                                    <>
                                                        <option value="image/webp" className="bg-[#0f172a]">WebP Format</option>
                                                        <option value="image/jpeg" className="bg-[#0f172a]">JPEG / JPG Format</option>
                                                        <option value="image/png" className="bg-[#0f172a]">PNG Format</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div className="flex gap-4 justify-center mt-8">
                                            <Button variant="ghost" onClick={() => setFile(null)}>
                                                Change File
                                            </Button>
                                            <Button 
                                                onClick={handleConvert} 
                                                loading={loading}
                                                className="bg-indigo-600 hover:bg-indigo-500 font-bold"
                                            >
                                                Convert Image
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-semibold mb-2">Upload Image File</p>
                                        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                                            Choose an image file (JPG, PNG, WEBP, or HEIC) to transform format instantly.
                                        </p>
                                        <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                            Choose File
                                        </Button>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,.heic"
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
                                    <p className="text-sm text-gray-400 mb-8 truncate max-w-md">"{convertedFile.filename}" is ready to download.</p>
                                    <div className="flex gap-4 justify-center">
                                        <Button variant="ghost" onClick={() => { setFile(null); setConvertedFile(null); }}>
                                            Convert Another
                                        </Button>
                                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                                            Download Image
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
