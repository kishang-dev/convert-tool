'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolSEOContent from '@/components/ToolSEOContent';
import Image from 'next/image';
import { LuUpload, LuDownload, LuTrash2, LuCrop, LuRotateCcw, LuFlipHorizontal } from 'react-icons/lu';

type Preset = '16:9' | '9:16' | '4:3' | '3:4' | '1:1' | '2:3' | 'free';

const ASPECT_PRESETS: { label: string; value: Preset; ratio: number | null }[] = [
    { label: 'Free', value: 'free', ratio: null },
    { label: '1:1', value: '1:1', ratio: 1 },
    { label: '16:9', value: '16:9', ratio: 16 / 9 },
    { label: '9:16', value: '9:16', ratio: 9 / 16 },
    { label: '4:3', value: '4:3', ratio: 4 / 3 },
    { label: '3:4', value: '3:4', ratio: 3 / 4 },
    { label: '2:3', value: '2:3', ratio: 2 / 3 },
];

const FORMAT_OPTIONS = [
    { label: 'JPEG', value: 'image/jpeg', ext: 'jpg' },
    { label: 'PNG', value: 'image/png', ext: 'png' },
    { label: 'WebP', value: 'image/webp', ext: 'webp' },
];

export default function ImageCropper() {
    const [file, setFile] = useState<File | null>(null);
    const [imgSrc, setImgSrc] = useState('');
    const [imgW, setImgW] = useState(0);
    const [imgH, setImgH] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [preset, setPreset] = useState<Preset>('free');
    const [format, setFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(92);
    const [outputUrl, setOutputUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Crop box: percentages of displayed image size
    const [box, setBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragRef = useRef<{ mode: string; startX: number; startY: number; startBox: typeof box } | null>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadFile = (f: File) => {
        if (!f.type.startsWith('image/')) { showToast('Please upload an image file.', 'error'); return; }
        setFile(f); setOutputUrl(''); setRotation(0); setFlipH(false); setFlipV(false);
        const url = URL.createObjectURL(f);
        setImgSrc(url);
        const img = new window.Image();
        img.onload = () => { setImgW(img.width); setImgH(img.height); };
        img.src = url;
        setBox({ x: 10, y: 10, w: 80, h: 80 });
    };

    // Apply aspect ratio lock
    const applyPreset = (p: Preset) => {
        setPreset(p);
        const preset = ASPECT_PRESETS.find(a => a.value === p);
        if (!preset?.ratio) return;
        const ratio = preset.ratio;
        // Keep box centered, adjust height to match ratio
        const newH = Math.min(80, box.w / ratio);
        setBox(b => ({ ...b, h: newH }));
    };

    // Touch/mouse unified pointer handlers
    const getEventPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    };

    const startDrag = (e: React.MouseEvent | React.TouchEvent, mode: string) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = getEventPos(e);
        dragRef.current = { mode, startX: pos.x, startY: pos.y, startBox: { ...box } };
    };

    useEffect(() => {
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!dragRef.current || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const pos = getEventPos(e);
            const dx = ((pos.x - dragRef.current.startX) / rect.width) * 100;
            const dy = ((pos.y - dragRef.current.startY) / rect.height) * 100;
            const sb = dragRef.current.startBox;
            const ratio = ASPECT_PRESETS.find(a => a.value === preset)?.ratio || null;
            const mode = dragRef.current.mode;

            setBox(prev => {
                let { x, y, w, h } = { ...sb };
                const minS = 5;

                if (mode === 'move') {
                    x = Math.max(0, Math.min(100 - w, sb.x + dx));
                    y = Math.max(0, Math.min(100 - h, sb.y + dy));
                } else {
                    if (mode.includes('r')) { w = Math.max(minS, Math.min(100 - sb.x, sb.w + dx)); }
                    if (mode.includes('l')) { const nw = Math.max(minS, sb.w - dx); x = sb.x + (sb.w - nw); w = nw; }
                    if (mode.includes('b')) { h = Math.max(minS, Math.min(100 - sb.y, sb.h + dy)); }
                    if (mode.includes('t')) { const nh = Math.max(minS, sb.h - dy); y = sb.y + (sb.h - nh); h = nh; }
                    if (ratio) { h = w / ratio; if (y + h > 100) { h = 100 - y; w = h * ratio; } }
                }
                return { x, y, w, h };
            });
        };
        const onUp = () => { dragRef.current = null; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
    }, [preset]);

    const cropImage = async () => {
        if (!imgSrc || !imgW || !imgH) return;
        const img = new window.Image();
        img.src = imgSrc;
        await new Promise(r => img.onload = r);

        const canvas = document.createElement('canvas');
        const cropX = (box.x / 100) * imgW;
        const cropY = (box.y / 100) * imgH;
        const cropW = (box.w / 100) * imgW;
        const cropH = (box.h / 100) * imgH;

        canvas.width = cropW; canvas.height = cropH;
        const ctx = canvas.getContext('2d')!;

        ctx.save();
        ctx.translate(cropW / 2, cropH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, cropX, cropY, cropW, cropH, -cropW / 2, -cropH / 2, cropW, cropH);
        ctx.restore();

        const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), format, quality / 100));
        setOutputUrl(URL.createObjectURL(blob));
        showToast('Image cropped!');
    };

    const download = () => {
        const ext = FORMAT_OPTIONS.find(f => f.value === format)?.ext || 'jpg';
        const a = document.createElement('a');
        a.href = outputUrl; a.download = `cropped.${ext}`; a.click();
    };

    const HANDLE_SIZE = 14;
    const handles = [
        { id: 'tl', top: `${box.y}%`, left: `${box.x}%` },
        { id: 'tr', top: `${box.y}%`, left: `${box.x + box.w}%` },
        { id: 'bl', top: `${box.y + box.h}%`, left: `${box.x}%` },
        { id: 'br', top: `${box.y + box.h}%`, left: `${box.x + box.w}%` },
        // Edge midpoints
        { id: 'r', top: `${box.y + box.h / 2}%`, left: `${box.x + box.w}%` },
        { id: 'l', top: `${box.y + box.h / 2}%`, left: `${box.x}%` },
        { id: 'b', top: `${box.y + box.h}%`, left: `${box.x + box.w / 2}%` },
        { id: 't', top: `${box.y}%`, left: `${box.x + box.w / 2}%` },
    ];

    const CURSOR_MAP: Record<string, string> = { tl: 'nwse-resize', tr: 'nesw-resize', bl: 'nesw-resize', br: 'nwse-resize', r: 'ew-resize', l: 'ew-resize', t: 'ns-resize', b: 'ns-resize', move: 'move' };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO title="Image Cropper – Free Online Tool" description="Crop images with custom ratios (1:1, 16:9, 4:3, free) directly in browser. Rotate, flip, and export as JPEG, PNG or WebP." canonical="/image-cropper" />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: 'Image Cropper', href: '/image-cropper' }]} />

                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Image Cropper</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">Drag the crop box to your perfect frame. All processing stays in your browser — zero upload.</p>
                </header>

                {!file ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
                        className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] hover:border-[var(--accent)]/50 bg-[var(--surface)]'}`}
                    >
                        <LuUpload className="w-14 h-14 text-slate-500 mb-4" />
                        <p className="font-semibold text-slate-300 text-lg mb-1">Drop image or click to browse</p>
                        <p className="text-sm text-slate-500">PNG, JPG, WebP, GIF supported</p>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadFile(e.target.files[0])} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Canvas */}
                        <div className="lg:col-span-2 space-y-3">
                            <div
                                ref={containerRef}
                                className="relative w-full overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] select-none"
                                style={{ userSelect: 'none', touchAction: 'none' }}
                            >
                                <img
                                    src={imgSrc} alt="Crop Preview"
                                    className="w-full block pointer-events-none"
                                    style={{ transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})` }}
                                    draggable={false}
                                />
                                {/* Dark overlay outside crop box */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute inset-0 bg-black/50" style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${box.x}% ${box.y}%, ${box.x}% ${box.y + box.h}%, ${box.x + box.w}% ${box.y + box.h}%, ${box.x + box.w}% ${box.y}%, ${box.x}% ${box.y}%)` }} />
                                </div>
                                {/* Crop box border */}
                                <div
                                    className="absolute border-2 border-white/90"
                                    style={{ top: `${box.y}%`, left: `${box.x}%`, width: `${box.w}%`, height: `${box.h}%`, cursor: 'move' }}
                                    onMouseDown={e => startDrag(e, 'move')}
                                    onTouchStart={e => startDrag(e, 'move')}
                                >
                                    {/* Rule of thirds grid */}
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                        {Array(9).fill(0).map((_, i) => <div key={i} className="border border-white/20" />)}
                                    </div>
                                </div>
                                {/* Resize handles */}
                                {handles.map(h => (
                                    <div
                                        key={h.id}
                                        className="absolute bg-white border-2 border-[var(--accent)] rounded-full z-10"
                                        style={{ top: h.top, left: h.left, width: HANDLE_SIZE, height: HANDLE_SIZE, transform: 'translate(-50%,-50%)', cursor: CURSOR_MAP[h.id] }}
                                        onMouseDown={e => startDrag(e, h.id)}
                                        onTouchStart={e => startDrag(e, h.id)}
                                    />
                                ))}
                            </div>

                            {outputUrl && (
                                <div className="rounded-xl overflow-hidden border border-green-500/40 bg-[var(--surface)]">
                                    <Image src={outputUrl} alt="cropped" width={800} height={800} className="w-full object-contain max-h-48" />
                                    <div className="p-3 flex items-center justify-between border-t border-[var(--border-strong)]">
                                        <span className="text-xs text-slate-400">Cropped result</span>
                                        <button onClick={download} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-semibold">
                                            <LuDownload className="w-4 h-4" /> Download
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="space-y-4">
                            {/* Aspect presets */}
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-slate-300 mb-3">Aspect Ratio</h2>
                                <div className="grid grid-cols-4 gap-2">
                                    {ASPECT_PRESETS.map(p => (
                                        <button key={p.value} onClick={() => applyPreset(p.value)} className={`py-1.5 rounded text-xs font-medium border transition-all ${preset === p.value ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] text-slate-400 hover:border-slate-500'}`}>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Transform */}
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-slate-300 mb-3">Transform</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setRotation(r => (r - 90 + 360) % 360)} className="flex items-center justify-center gap-2 py-2 border border-[var(--border-strong)] rounded text-sm text-slate-300 hover:border-slate-500">
                                        <LuRotateCcw className="w-4 h-4" /> Rotate L
                                    </button>
                                    <button onClick={() => setRotation(r => (r + 90) % 360)} className="flex items-center justify-center gap-2 py-2 border border-[var(--border-strong)] rounded text-sm text-slate-300 hover:border-slate-500">
                                        <LuRotateCcw className="w-4 h-4 scale-x-[-1]" /> Rotate R
                                    </button>
                                    <button onClick={() => setFlipH(h => !h)} className={`flex items-center justify-center gap-2 py-2 border rounded text-sm transition-all ${flipH ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-strong)] text-slate-300 hover:border-slate-500'}`}>
                                        <LuFlipHorizontal className="w-4 h-4" /> Flip H
                                    </button>
                                    <button onClick={() => setFlipV(v => !v)} className={`flex items-center justify-center gap-2 py-2 border rounded text-sm transition-all ${flipV ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border-strong)] text-slate-300 hover:border-slate-500'}`}>
                                        <LuFlipHorizontal className="w-4 h-4 rotate-90" /> Flip V
                                    </button>
                                </div>
                            </div>

                            {/* Format */}
                            <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl p-5 space-y-3">
                                <h2 className="text-sm font-semibold text-slate-300">Output Format</h2>
                                <div className="flex gap-2">
                                    {FORMAT_OPTIONS.map(f => (
                                        <button key={f.value} onClick={() => setFormat(f.value)} className={`flex-1 py-1.5 rounded text-xs font-medium border transition-all ${format === f.value ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border-strong)] text-slate-400'}`}>
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

                            <button onClick={cropImage} className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <LuCrop className="w-5 h-5" /> Crop Image
                            </button>
                            <button onClick={() => { setFile(null); setImgSrc(''); setOutputUrl(''); }} className="w-full py-2 border border-[var(--border-strong)] text-slate-400 rounded-xl hover:border-red-500 hover:text-red-400 text-sm">
                                <LuTrash2 className="inline w-4 h-4 mr-2" /> Remove Image
                            </button>
                        </div>
                    </div>
                )}

                <ToolSEOContent toolName="Image Cropper" toolDescription="Free online image cropper with aspect ratio presets and rotate/flip support." />
            </main>
            <Footer />
        </div>
    );
}
