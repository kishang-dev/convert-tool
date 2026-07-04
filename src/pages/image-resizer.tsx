import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, ImageIcon, Download, ArrowRight, RefreshCw, Sparkles, Check, Ratio } from 'lucide-react';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function ImageResizer() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [originalWidth, setOriginalWidth] = useState<number>(0);
    const [originalHeight, setOriginalHeight] = useState<number>(0);
    const [aspectRatio, setAspectRatio] = useState<number>(1);
    const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
    const [quality, setQuality] = useState<number>(90);
    const [format, setFormat] = useState<string>('image/jpeg');
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
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        const img = new Image();
        img.onload = () => {
            setOriginalWidth(img.width);
            setOriginalHeight(img.height);
            setWidth(img.width);
            setHeight(img.height);
            setAspectRatio(img.width / img.height);
            // Auto detect format from original file type
            if (file.type === 'image/png') {
                setFormat('image/png');
            } else if (file.type === 'image/webp') {
                setFormat('image/webp');
            } else {
                setFormat('image/jpeg');
            }
        };
        img.src = url;

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleWidthChange = (val: number) => {
        setWidth(val);
        if (lockAspectRatio && val > 0) {
            setHeight(Math.round(val / aspectRatio));
        }
    };

    const handleHeightChange = (val: number) => {
        setHeight(val);
        if (lockAspectRatio && val > 0) {
            setWidth(Math.round(val * aspectRatio));
        }
    };

    const handlePercentScale = (percent: number) => {
        const newW = Math.round(originalWidth * (percent / 100));
        const newH = Math.round(originalHeight * (percent / 100));
        setWidth(newW);
        setHeight(newH);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith('image/')) {
                showToast('Please select a valid image file', 'error');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleResize = () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'image-resizer'
        });
        if (!file || !previewUrl) return;

        setLoading(true);
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get 2D canvas context');

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height);
                
                // Export image at configured format and quality
                const q = quality / 100;
                const resizedDataUrl = canvas.toDataURL(format, format === 'image/png' ? undefined : q);

                const link = document.createElement('a');
                link.href = resizedDataUrl;
                
                // Construct output filename
                const ext = format.split('/')[1] === 'jpeg' ? 'jpg' : format.split('/')[1];
                const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
                link.download = `${baseName}_resized_${width}x${height}.${ext}`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Image resized and downloaded successfully!', 'success');
                setLoading(false);
            };
            img.src = previewUrl;

        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Resizing failed', 'error');
            setLoading(false);
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Image Resizer Tools",
        "description": "Resize JPG, PNG, and WEBP images in seconds client-side. Lock aspect ratio, select quality, and compress dimensions.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/image-resizer`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-[var(--text)] dark:text-[var(--text)]">
            <SEO 
                title="Image Resizer Tools" 
                description="Resize JPG, PNG, and WEBP images in seconds client-side. Lock aspect ratio, select quality, and compress dimensions." 
                canonical="/image-resizer"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Image Resizer</span>
                    </h1>
                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Compress, scale, and resize your images instantly right in your browser with zero server uploads.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Panel: Preview/Upload */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <Card variant="elevated" className="p-6 h-full flex flex-col items-center justify-center min-h-[400px]">
                            {previewUrl ? (
                                <div className="w-full flex flex-col items-center gap-4 flex-grow justify-center">
                                    <div className="relative border border-[var(--border)] dark:border-[var(--border)] rounded overflow-hidden max-h-[380px] bg-slate-950/60 p-2 flex items-center justify-center">
                                        <img src={previewUrl} alt="Preview" loading="lazy" className="max-h-[350px] object-contain rounded" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold truncate max-w-xs">{file?.name}</p>
                                        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">Original Dimensions: {originalWidth} x {originalHeight} px</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-[var(--accent)]/10 rounded flex items-center justify-center mb-4">
                                        <Upload size={40} className="text-[var(--accent)]" />
                                    </div>
                                    <p className="text-xl font-semibold mb-2">Upload Image File</p>
                                    <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-6 max-w-sm">
                                        Select JPEG, PNG, or WebP format to start scaling your images
                                    </p>
                                    <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                        Choose Image
                                    </Button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </Card>
                    </div>

                    {/* Right Panel: Settings */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {file ? (
                            <Card variant="elevated" className="p-6 space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-[var(--text)] border-b border-[var(--border)] pb-2 flex items-center gap-2">
                                        <Sparkles size={18} className="text-[var(--accent)]" />
                                        Resize Settings
                                    </h3>

                                    {/* Dimensions */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Width (px)</label>
                                            <input
                                                type="number"
                                                value={width || ''}
                                                onChange={(e) => handleWidthChange(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] rounded focus:border-[var(--accent-ring)] outline-none text-[var(--text)] dark:text-[var(--text)] font-mono text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Height (px)</label>
                                            <input
                                                type="number"
                                                value={height || ''}
                                                onChange={(e) => handleHeightChange(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] rounded focus:border-[var(--accent-ring)] outline-none text-[var(--text)] dark:text-[var(--text)] font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Lock Aspect Ratio */}
                                    <label className="flex items-center gap-2.5 cursor-pointer group text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted)]">
                                        <input
                                            type="checkbox"
                                            checked={lockAspectRatio}
                                            onChange={(e) => setLockAspectRatio(e.target.checked)}
                                            className="w-4 h-4 rounded border-[var(--border)] dark:border-[var(--border)] bg-[var(--surface)] dark:bg-[var(--accent-soft)] text-[var(--accent)] focus:ring-0"
                                        />
                                        <Ratio size={16} className="text-[var(--accent)]" />
                                        Lock Aspect Ratio
                                    </label>

                                    {/* Presets */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase block">Presets</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {[25, 50, 75, 100, 150, 200].map(pct => (
                                                <button
                                                    key={pct}
                                                    onClick={() => handlePercentScale(pct)}
                                                    className="px-3 py-1.5 bg-[var(--surface)] dark:bg-[var(--accent-soft)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded text-xs font-semibold font-mono transition-all"
                                                >
                                                    {pct}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Formats */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase block">Export Format</label>
                                        <select
                                            value={format}
                                            onChange={(e) => setFormat(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] rounded text-sm text-[var(--text)] outline-none"
                                        >
                                            <option value="image/jpeg" className="bg-[#0f172a]">JPEG / JPG</option>
                                            <option value="image/png" className="bg-[#0f172a]">PNG</option>
                                            <option value="image/webp" className="bg-[#0f172a]">WebP</option>
                                        </select>
                                    </div>

                                    {/* Quality Slider (JPEG/WEBP) */}
                                    {format !== 'image/png' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Image Quality</label>
                                                <span className="text-xs font-bold font-mono text-[var(--accent)]">{quality}%</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="10"
                                                max="100"
                                                value={quality}
                                                onChange={(e) => setQuality(Number(e.target.value))}
                                                className="w-full h-1.5 bg-[var(--surface-hover)] rounded appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-[var(--border)]">
                                    <Button variant="ghost" onClick={() => setFile(null)} className="w-1/3">
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={handleResize}
                                        loading={loading}
                                        className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold flex-grow text-sm py-3"
                                    >
                                        Resize & Download
                                        <Download size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card variant="elevated" className="p-8 flex flex-col items-center justify-center text-center h-full text-[var(--text-faint)] dark:text-[var(--text-faint)]">
                                <ImageIcon size={48} className="opacity-10 mb-3" />
                                <p className="text-base font-semibold">Resize properties</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Properties, percentages, and quality sliders will appear after uploading an image.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        
            <ToolSEOContent toolName="Image Resizer Tools" toolDescription="Resize JPG, PNG, and WEBP images in seconds client-side. Lock aspect ratio, select quality, and compress dimensions." />
            <Footer />
        </div>
    );
}
