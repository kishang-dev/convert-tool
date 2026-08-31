'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolSEOContent from '@/components/ToolSEOContent';
import { LuUpload, LuDownload, LuTrash2, LuArrowRight, LuCheck, LuRefreshCw, LuImage } from 'react-icons/lu';
import AdBanner from "@/components/AdBanner";

const CONVERSIONS = [
    { from: 'any', to: 'image/jpeg', ext: 'jpg', label: 'Convert to JPG' },
    { from: 'any', to: 'image/png', ext: 'png', label: 'Convert to PNG' },
    { from: 'any', to: 'image/webp', ext: 'webp', label: 'Convert to WebP' },
    { from: 'any', to: 'image/bmp', ext: 'bmp', label: 'Convert to BMP' },
];

interface ConvFile {
    file: File;
    previewUrl: string;
    status: 'pending' | 'done' | 'error';
    outputUrl?: string;
    outputSize?: string;
}

export default function ImageConverter() {
    const [convFiles, setConvFiles] = useState<ConvFile[]>([]);
    const [targetFormat, setTargetFormat] = useState('image/webp');
    const [quality, setQuality] = useState(90);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addFiles = (files: FileList | File[]) => {
        const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (!arr.length) { showToast('Please upload image files only.', 'error'); return; }
        const newItems: ConvFile[] = arr.map(f => ({
            file: f,
            previewUrl: URL.createObjectURL(f),
            status: 'pending',
        }));
        setConvFiles(prev => [...prev, ...newItems]);
    };

    const convertAll = async () => {
        if (!convFiles.length) return;
        setLoading(true);
        const results: ConvFile[] = [];
        for (const cf of convFiles) {
            try {
                const img = new window.Image();
                img.src = cf.previewUrl;
                await new Promise(r => img.onload = r);
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0);
                const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), targetFormat, quality / 100));
                results.push({ ...cf, status: 'done', outputUrl: URL.createObjectURL(blob), outputSize: `${(blob.size / 1024).toFixed(1)} KB` });
            } catch {
                results.push({ ...cf, status: 'error' });
            }
        }
        setConvFiles(results);
        setLoading(false);
        showToast(`Converted ${results.filter(r => r.status === 'done').length} image(s)!`);
    };

    const downloadFile = (cf: ConvFile) => {
        if (!cf.outputUrl) return;
        const ext = CONVERSIONS.find(c => c.to === targetFormat)?.ext || 'jpg';
        const base = cf.file.name.replace(/\.[^/.]+$/, '');
        const a = document.createElement('a');
        a.href = cf.outputUrl; a.download = `${base}.${ext}`; a.click();
    };

    const downloadAll = () => {
        convFiles.filter(f => f.status === 'done').forEach(downloadFile);
    };

    const removeFile = (i: number) => setConvFiles(prev => prev.filter((_, idx) => idx !== i));
    const reset = () => setConvFiles([]);

    const ext = CONVERSIONS.find(c => c.to === targetFormat)?.ext || 'jpg';

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Free Image Converter Online — Convert JPG, PNG, WebP, GIF, BMP"
                description="Batch convert images online for free between JPG, PNG, WebP, GIF, and BMP formats instantly in your browser. 100% private client-side processing with zero server uploads."
                canonical="/image-converter"
                keywords={[
                    "image converter online",
                    "convert image to jpg",
                    "convert image to png",
                    "convert image to webp",
                    "batch image converter free",
                    "heic to jpg converter",
                    "photo format converter"
                ]}
            />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-5xl mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: 'Image Converter', href: '/image-converter' }]} />

                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Image Converter</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Batch convert images to JPG, PNG, WebP, or BMP — all in your browser with zero uploads.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings */}
                    <div className="space-y-4">
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                            <h2 className="text-sm font-semibold text-slate-300 mb-4">Target Format</h2>
                            <div className="space-y-2">
                                {CONVERSIONS.map(c => (
                                    <button key={c.to} onClick={() => setTargetFormat(c.to)} className={`w-full flex items-center justify-between px-4 py-2.5 rounded border transition-all text-sm ${targetFormat === c.to ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--border-strong)] text-slate-300 hover:border-slate-500'}`}>
                                        {c.label} {targetFormat === c.to && <LuCheck className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {targetFormat !== 'image/png' && targetFormat !== 'image/bmp' && (
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                                <label className="flex justify-between text-xs text-slate-500 mb-2"><span>Quality</span><span className="text-[var(--accent)] font-bold">{quality}%</span></label>
                                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(parseInt(e.target.value))} className="w-full accent-[var(--accent)]" />
                            </div>
                        )}

                        {convFiles.length > 0 && (
                            <div className="space-y-2">
                                <button onClick={convertAll} disabled={loading} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Converting...</> : <><LuRefreshCw className="w-4 h-4" /> Convert All to .{ext}</>}
                                </button>
                                {convFiles.some(f => f.status === 'done') && (
                                    <button onClick={downloadAll} className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                                        <LuDownload className="w-4 h-4" /> Download All
                                    </button>
                                )}
                                <button onClick={reset} className="w-full py-2 border border-[var(--border-strong)] text-slate-400 rounded-xl hover:border-red-500 hover:text-red-400 text-sm">
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* File list + drop zone */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Drop zone */}
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer transition-all ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] hover:border-[var(--accent)]/50 bg-[var(--surface)]'}`}
                        >
                            <LuUpload className="w-10 h-10 text-slate-500 mb-3" />
                            <p className="text-slate-300 font-medium">Drop images here or click to add</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP, GIF, BMP, AVIF</p>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
                        </div>

                        {/* File cards */}
                        {convFiles.length > 0 && (
                            <div className="space-y-2">
                                {convFiles.map((cf, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${cf.status === 'done' ? 'border-green-500/40 bg-green-500/5' : cf.status === 'error' ? 'border-red-500/40 bg-red-500/5' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                                        <Image src={cf.previewUrl} alt={cf.file.name || "Converted Image Preview"} width={56} height={56} className="w-14 h-14 object-cover rounded" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate text-slate-200">{cf.file.name}</p>
                                            <p className="text-xs text-slate-500">{(cf.file.size / 1024).toFixed(1)} KB → {cf.outputSize || '—'}</p>
                                        </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                                        <div className="flex items-center gap-2 shrink-0">
                                            {cf.status === 'done' && (
                                                <>
                                                    <span className="text-green-400 text-xs font-medium">✓</span>
                                                    <button onClick={() => downloadFile(cf)} className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40"><LuDownload className="w-4 h-4" /></button>
                                                </>
                                            )}
                                            {cf.status === 'error' && <span className="text-red-400 text-xs">Error</span>}
                                            {cf.status === 'pending' && (
                                                <LuImage className="w-4 h-4 text-slate-500" />
                                            )}
                                            <button onClick={() => removeFile(i)} className="p-2 text-slate-500 hover:text-red-400 rounded"><LuTrash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <ToolSEOContent toolName="Image Converter" toolDescription="Batch convert images between formats in browser." />
            </main>
            <Footer />
        </div>
    );
}
