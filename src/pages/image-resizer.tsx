'use client';
import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolSEOContent from '@/components/ToolSEOContent';
import { LuUpload, LuDownload, LuTrash2, LuZoomIn, LuZoomOut, LuRefreshCw, LuCheck } from 'react-icons/lu';
import AdBanner from "@/components/AdBanner";

// ── Client-side: no backend needed ───────────────────────────────────────────
const PRESETS = [
    { label: 'Custom', w: 0, h: 0 },
    { label: 'HD 1280×720', w: 1280, h: 720 },
    { label: 'Full HD 1920×1080', w: 1920, h: 1080 },
    { label: '4K 3840×2160', w: 3840, h: 2160 },
    { label: 'Square 1:1 1080×1080', w: 1080, h: 1080 },
    { label: 'Twitter 1500×500', w: 1500, h: 500 },
    { label: 'Instagram 1080×1350', w: 1080, h: 1350 },
    { label: 'LinkedIn 1200×627', w: 1200, h: 627 },
    { label: 'A4 Print 2480×3508', w: 2480, h: 3508 },
];

const FORMAT_OPTIONS = [
    { label: 'JPEG', value: 'image/jpeg', ext: 'jpg' },
    { label: 'PNG', value: 'image/png', ext: 'png' },
    { label: 'WebP', value: 'image/webp', ext: 'webp' },
];

export default function ImageResizer() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [origW, setOrigW] = useState(0);
    const [origH, setOrigH] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lockAspect, setLockAspect] = useState(true);
    const [quality, setQuality] = useState(90);
    const [format, setFormat] = useState('image/jpeg');
    const [outputUrl, setOutputUrl] = useState('');
    const [outputSize, setOutputSize] = useState('');
    const [origSize, setOrigSize] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadFile = (f: File) => {
        if (!f.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); return; }
        setFile(f);
        setOrigSize(`${(f.size / 1024).toFixed(1)} KB`);
        const url = URL.createObjectURL(f);
        setPreview(url);
        const img = new window.Image();
        img.onload = () => {
            setOrigW(img.width); setOrigH(img.height);
            setWidth(img.width); setHeight(img.height);
        };
        img.src = url;
        setOutputUrl('');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) loadFile(f);
    };

    const handleWidthChange = (v: number) => {
        setWidth(v);
        if (lockAspect && origW) setHeight(Math.round(v / (origW / origH)));
    };
    const handleHeightChange = (v: number) => {
        setHeight(v);
        if (lockAspect && origH) setWidth(Math.round(v / (origH / origW)));
    };

    const applyPreset = (p: typeof PRESETS[0]) => {
        if (p.w === 0) return;
        setWidth(p.w); setHeight(p.h);
        setLockAspect(false);
    };

    const resize = async () => {
        if (!file || !width || !height) return;
        setLoading(true);
        try {
            const img = new window.Image();
            img.src = preview;
            await new Promise(r => img.onload = r);
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, width, height);
            const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), format, quality / 100));
            const url = URL.createObjectURL(blob);
            setOutputUrl(url);
            setOutputSize(`${(blob.size / 1024).toFixed(1)} KB`);
            showToast('Image resized successfully!');
        } catch { showToast('Resize failed.', 'error'); }
        setLoading(false);
    };

    const download = () => {
        if (!outputUrl) return;
        const ext = FORMAT_OPTIONS.find(f => f.value === format)?.ext || 'jpg';
        const a = document.createElement('a');
        a.href = outputUrl; a.download = `resized.${ext}`; a.click();
    };

    const reset = () => {
        setFile(null); setPreview(''); setOutputUrl('');
        setOrigW(0); setOrigH(0); setWidth(0); setHeight(0);
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Free Image Resizer Online — Resize JPG, PNG & WebP by Pixel & Percentage"
                description="Resize image dimensions online for free by pixel width, height, or social media preset dimensions (Twitter, Instagram, YouTube). Works 100% client-side in browser."
                canonical="/image-resizer"
                keywords={[
                    "image resizer online",
                    "resize image by pixel",
                    "photo resizer free",
                    "resize jpg png webp",
                    "image pixel reducer",
                    "change image dimensions",
                    "social media image resizer"
                ]}
            />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: 'Image Resizer', href: '/image-resizer' }]} />

                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Image Resizer</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Resize any image to exact dimensions or a preset size. Works 100% in your browser — no upload to server.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ── Upload / Preview ── */}
                    <div className="space-y-4">
                        {!file ? (
                            <div
                                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[300px] ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] hover:border-[var(--accent)]/50 bg-[var(--surface)]'}`}
                            >
                                <LuUpload className="w-12 h-12 text-slate-500 mb-4" />
                                <p className="font-semibold text-slate-300 mb-1">Drop image here or click to browse</p>
                                <p className="text-xs text-slate-500">PNG, JPG, WebP, GIF, AVIF</p>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)]">
                                <Image src={preview} alt="original" width={800} height={800} className="w-full object-contain max-h-64 md:max-h-80" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={reset} className="bg-red-600/90 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow"><LuTrash2 className="w-4 h-4" /></button>
                                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                                <div className="p-3 flex gap-4 text-xs text-slate-400 border-t border-[var(--border-strong)]">
                                    <span>Original: <strong>{origW}×{origH}</strong></span>
                                    <span>Size: <strong>{origSize}</strong></span>
                                </div>
                            </div>
                        )}

                        {/* Output preview */}
                        {outputUrl && (
                            <div className="rounded-xl overflow-hidden border border-green-500/40 bg-[var(--surface)]">
                                <Image src={outputUrl} alt="resized" width={800} height={800} className="w-full object-contain max-h-64" />
                                <div className="p-3 flex items-center justify-between border-t border-[var(--border-strong)]">
                                    <div className="text-xs text-slate-400">Output: <strong>{width}×{height}</strong> · <strong>{outputSize}</strong></div>
                                    <button onClick={download} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-semibold transition-all">
                                        <LuDownload className="w-4 h-4" /> Download
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Settings Panel ── */}
                    <div className="space-y-4">
                        {/* Preset Sizes */}
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-300 mb-3">📐 Preset Sizes</h2>
                            <div className="flex flex-wrap gap-2">
                                {PRESETS.slice(1).map(p => (
                                    <button key={p.label} onClick={() => applyPreset(p)} className="px-3 py-1 bg-[var(--bg)] border border-[var(--border-strong)] rounded text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-300 mb-4">📏 Dimensions</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Width (px)</label>
                                    <input type="number" value={width || ''} onChange={e => handleWidthChange(parseInt(e.target.value) || 0)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 mb-1 block">Height (px)</label>
                                    <input type="number" value={height || ''} onChange={e => handleHeightChange(parseInt(e.target.value) || 0)} className="w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-2 text-sm outline-none focus:border-[var(--accent)]" />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <input type="checkbox" checked={lockAspect} onChange={e => setLockAspect(e.target.checked)} className="accent-[var(--accent)] w-4 h-4" />
                                <span className="text-slate-300">Lock aspect ratio</span>
                            </label>
                        </div>

                        {/* Output Format & Quality */}
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-slate-300">🎨 Output Format & Quality</h2>
                            <div className="flex gap-2">
                                {FORMAT_OPTIONS.map(f => (
                                    <button key={f.value} onClick={() => setFormat(f.value)} className={`flex-1 py-2 rounded text-sm font-medium border transition-all ${format === f.value ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--border-strong)] text-slate-400 hover:border-slate-500'}`}>
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                            {format !== 'image/png' && (
                                <div>
                                    <label className="flex justify-between text-xs text-slate-500 mb-1"><span>Quality</span><span className="text-[var(--accent)] font-bold">{quality}%</span></label>
                                    <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={resize}
                            disabled={!file || loading}
                            className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resizing...</> : <><LuZoomOut className="w-4 h-4" />Resize Image</>}
                        </button>
                    </div>
                </div>

                <ToolSEOContent toolName="Image Resizer" toolDescription="Free client-side image resizer for PNG, JPG and WebP images." />
            </main>
            <Footer />
        </div>
    );
}
