'use client';
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolSEOContent from '@/components/ToolSEOContent';
import { LuUpload, LuDownload, LuTrash2, LuCheck, LuSlidersHorizontal } from 'react-icons/lu';
import AdBanner from "@/components/AdBanner";

interface ConvFile {
    file: File;
    previewUrl: string;
    status: 'pending' | 'done' | 'error';
    outputUrl?: string;
    origSize: string;
    outputSize?: string;
}

export default function ConvertToJpg() {
    const [files, setFiles] = useState<ConvFile[]>([]);
    const [quality, setQuality] = useState(90);
    const [background, setBackground] = useState('#ffffff');
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000);
    };

    const addFiles = (fileList: FileList | File[]) => {
        const arr = Array.from(fileList).filter(f => f.type.startsWith('image/'));
        if (!arr.length) { showToast('Please upload image files.', 'error'); return; }
        setFiles(prev => [...prev, ...arr.map(f => ({
            file: f, previewUrl: URL.createObjectURL(f),
            status: 'pending' as const, origSize: `${(f.size / 1024).toFixed(1)} KB`
        }))]);
    };

    const convertAll = async () => {
        setLoading(true);
        const results: ConvFile[] = [];
        for (const cf of files) {
            try {
                const img = new window.Image();
                img.src = cf.previewUrl;
                await new Promise(r => img.onload = r);
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;
                // Fill background for transparent PNGs
                ctx.fillStyle = background;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', quality / 100));
                results.push({ ...cf, status: 'done', outputUrl: URL.createObjectURL(blob), outputSize: `${(blob.size / 1024).toFixed(1)} KB` });
            } catch {
                results.push({ ...cf, status: 'error' });
            }
        }
        setFiles(results);
        setLoading(false);
        showToast(`Converted ${results.filter(r => r.status === 'done').length} file(s) to JPG!`);
    };

    const downloadFile = (cf: ConvFile) => {
        if (!cf.outputUrl) return;
        const a = document.createElement('a');
        a.href = cf.outputUrl; a.download = cf.file.name.replace(/\.[^/.]+$/, '') + '.jpg'; a.click();
    };

    const downloadAll = () => files.filter(f => f.status === 'done').forEach(downloadFile);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Convert to JPG – Free Online Tool" description="Convert PNG, WebP, BMP, AVIF, GIF to JPG online. Batch convert with quality control and transparent background fill." canonical="/convert-to-jpg" />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: 'Convert to JPG', href: '/convert-to-jpg' }]} />
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Convert to JPG</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Convert PNG, WebP, BMP, AVIF, GIF — any image — to JPEG format. Batch convert, control quality, fill transparent backgrounds.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Settings */}
                    <div className="space-y-4">
                        <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5 space-y-4">
                            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><LuSlidersHorizontal className="w-4 h-4" /> Settings</h2>
                            <div>
                                <label className="flex justify-between text-xs text-slate-500 mb-1"><span>Quality</span><span className="text-[var(--accent)] font-bold">{quality}%</span></label>
                                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-[var(--accent)]" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 block mb-1">Background Color (for transparent images)</label>
                                <div className="flex gap-3 items-center">
                                    <input type="color" value={background} onChange={e => setBackground(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                                    <span className="text-sm font-mono text-slate-300">{background.toUpperCase()}</span>
                                    <button onClick={() => setBackground('#ffffff')} className="text-xs text-slate-500 hover:text-slate-300">Reset</button>
                                </div>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                <button onClick={convertAll} disabled={loading} className="w-full py-3 bg-[var(--accent)] text-white rounded-xl font-semibold hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Converting...</> : 'Convert All to JPG'}
                                </button>
                                {files.some(f => f.status === 'done') && (
                                    <button onClick={downloadAll} className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                                        <LuDownload className="w-4 h-4" /> Download All
                                    </button>
                                )}
                                <button onClick={() => setFiles([])} className="w-full py-2 border border-[var(--border-strong)] text-slate-400 rounded-xl text-sm hover:text-red-400 hover:border-red-500">Clear All</button>
                            </div>
                        )}
                    </div>

                    {/* Drop + File List */}
                    <div className="lg:col-span-2 space-y-3">
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer transition-all ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] hover:border-[var(--accent)]/50 bg-[var(--surface)]'}`}
                        >
                            <LuUpload className="w-10 h-10 text-slate-500 mb-3" />
                            <p className="text-slate-300 font-medium">Drop images here or click to add</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, WebP, BMP, AVIF, GIF → JPG</p>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
                        </div>

                        <div className="space-y-2">
                            {files.map((cf, i) => (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${cf.status === 'done' ? 'border-green-500/40 bg-green-500/5' : cf.status === 'error' ? 'border-red-500/40' : 'border-[var(--border-strong)] bg-[var(--surface)]'}`}>
                                    <Image src={cf.previewUrl} alt="" width={56} height={56} className="w-14 h-14 object-cover rounded flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-slate-200">{cf.file.name}</p>
                                        <p className="text-xs text-slate-500">{cf.origSize} {cf.outputSize && `→ ${cf.outputSize}`}</p>
                                    </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                                    <div className="flex items-center gap-2 shrink-0">
                                        {cf.status === 'done' && <button onClick={() => downloadFile(cf)} className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40"><LuDownload className="w-4 h-4" /></button>}
                                        {cf.status === 'error' && <span className="text-red-400 text-xs">Error</span>}
                                        <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="p-2 text-slate-500 hover:text-red-400 rounded"><LuTrash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <ToolSEOContent toolName="Convert to JPG" toolDescription="Convert any image to JPG online." />
            </main>
            <Footer />
        </div>
    );
}
