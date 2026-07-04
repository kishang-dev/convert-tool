import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, Download, ArrowRight, CheckCircle, FileImage, Settings, RefreshCw } from 'lucide-react';
import api, { fileAPI, FileData } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

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
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'image-converter'
        });
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

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Image Converter",
        "description": "Convert images instantly online. HEIC to JPG, WEBP to PNG, PNG to WEBP and more. Free image format converter with no watermarks or sign-up required.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/image-converter`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)]">
            <SEO
                title="Image Converter — HEIC to JPG, WEBP, PNG Online Free"
                description="Convert images instantly online. HEIC to JPG, WEBP to PNG, PNG to WEBP and more. Free image format converter with no watermarks or sign-up required."
                canonical="/image-converter"
                keywords="HEIC to JPG, image converter online, WEBP to JPG, PNG to WEBP, free image format converter, convert image online"
                structuredData={structuredData}
            />
            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-4xl mx-auto px-4 py-24">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
                        <span className="gradient-text">Image Converter</span>
                    </h1>
                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-lg">
                        Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, PNG to WEBP, and more.
                    </p>
                </div>

                <div className="grid gap-8">
                    <Card variant="elevated" className="p-8 md:p-12 relative overflow-hidden">
                        {!convertedFile ? (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-[var(--accent)]/10 rounded flex items-center justify-center mb-2">
                                    {file ? (
                                        <FileImage size={40} className="text-[var(--accent)] animate-pulse" />
                                    ) : (
                                        <Upload size={40} className="text-[var(--accent)]" />
                                    )}
                                </div>

                                {file ? (
                                    <div className="w-full max-w-md text-center space-y-6">
                                        <div>
                                            <p className="text-xl font-semibold mb-1 truncate">{file.name}</p>
                                            <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB • Detected: {file.name.split('.').pop()?.toUpperCase()}</p>
                                        </div>

                                        {previewUrl && (
                                            <div className="flex justify-center p-2 bg-slate-950/40 border border-[var(--border)] rounded max-h-[200px] overflow-hidden">
                                                <img src={previewUrl} alt="Thumbnail" loading="lazy" className="max-h-[180px] object-contain rounded" />
                                            </div>
                                        )}

                                        {/* Format selector */}
                                        <div className="space-y-2 text-left">
                                            <label className="text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted)] flex items-center gap-1.5">
                                                <Settings size={16} className="text-[var(--accent)]" />
                                                Convert To:
                                            </label>
                                            <select
                                                value={outFormat}
                                                onChange={(e) => setOutFormat(e.target.value)}
                                                className="w-full px-4 py-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] rounded focus:border-[var(--accent-ring)] outline-none text-[var(--text)] dark:text-[var(--text)] text-sm"
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
                                                className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                                            >
                                                Convert Image
                                                <ArrowRight size={18} className="ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-xl font-semibold mb-2">Upload Image File</p>
                                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
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
                                    <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-8 truncate max-w-md">"{convertedFile.filename}" is ready to download.</p>
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
        
            <ToolSEOContent toolName="Image Converter — HEIC to JPG, WEBP, PNG" toolDescription="Convert images instantly online. HEIC to JPG, WEBP to PNG, PNG to WEBP and more. Free image format converter with no watermarks or sign-up required." />
            <Footer />
        </div>
    );
}
