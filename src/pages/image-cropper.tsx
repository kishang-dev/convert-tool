import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Upload, Crop, Download, ArrowRight, RefreshCw, Ratio, Maximize, Move } from 'lucide-react';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function ImageCropper() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '16:9' | '4:3'>('free');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // Crop box state (percentages of container size to adapt responsively)
    const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isDragging = useRef<boolean>(false);
    const isResizing = useRef<string | null>(null); // 'tl', 'tr', 'bl', 'br', 'move'
    const dragStart = useRef({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setCropBox({ x: 15, y: 15, w: 70, h: 70 });
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl('');
    }, [file]);

    // Update crop aspect ratio preset changes
    useEffect(() => {
        if (aspectPreset === 'free') return;
        
        let ratio = 1;
        if (aspectPreset === '1:1') ratio = 1;
        else if (aspectPreset === '16:9') ratio = 16 / 9;
        else if (aspectPreset === '4:3') ratio = 4 / 3;

        setCropBox(prev => {
            const newW = prev.w;
            let newH = newW / ratio;
            // Bound checks
            if (prev.y + newH > 100) {
                newH = 100 - prev.y;
            }
            return { ...prev, h: newH };
        });
    }, [aspectPreset]);

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

    // Mouse and Touch crop handlers
    const startAction = (type: string, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        if (type === 'move') {
            isDragging.current = true;
            isResizing.current = 'move';
        } else {
            isDragging.current = true;
            isResizing.current = type;
        }

        dragStart.current = {
            x: clientX,
            y: clientY,
            boxX: cropBox.x,
            boxY: cropBox.y,
            boxW: cropBox.w,
            boxH: cropBox.h
        };
    };

    const doAction = (e: MouseEvent | TouchEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = ((clientX - dragStart.current.x) / rect.width) * 100;
        const deltaY = ((clientY - dragStart.current.y) / rect.height) * 100;

        let { boxX, boxY, boxW, boxH } = dragStart.current;

        if (isResizing.current === 'move') {
            let nextX = boxX + deltaX;
            let nextY = boxY + deltaY;

            // Bound checks
            if (nextX < 0) nextX = 0;
            if (nextY < 0) nextY = 0;
            if (nextX + boxW > 100) nextX = 100 - boxW;
            if (nextY + boxH > 100) nextY = 100 - boxH;

            setCropBox({ x: nextX, y: nextY, w: boxW, h: boxH });
        } else {
            let nextX = boxX;
            let nextY = boxY;
            let nextW = boxW;
            let nextH = boxH;

            const type = isResizing.current;

            if (type?.includes('r')) {
                nextW = boxW + deltaX;
                if (nextX + nextW > 100) nextW = 100 - nextX;
            }
            if (type?.includes('b')) {
                nextH = boxH + deltaY;
                if (nextY + nextH > 100) nextH = 100 - nextY;
            }
            if (type?.includes('l')) {
                nextX = boxX + deltaX;
                if (nextX < 0) {
                    nextX = 0;
                } else {
                    nextW = boxW - deltaX;
                }
            }
            if (type?.includes('t')) {
                nextY = boxY + deltaY;
                if (nextY < 0) {
                    nextY = 0;
                } else {
                    nextH = boxH - deltaY;
                }
            }

            // Aspect ratio constraint
            if (aspectPreset !== 'free') {
                let ratio = 1;
                if (aspectPreset === '1:1') ratio = 1;
                else if (aspectPreset === '16:9') ratio = 16 / 9;
                else if (aspectPreset === '4:3') ratio = 4 / 3;

                // Adjust based on the dominant scaling handle
                if (type === 'br' || type === 'tr' || type === 'r') {
                    nextH = nextW / ratio;
                } else {
                    nextW = nextH * ratio;
                }
                
                // Outer check
                if (nextX + nextW > 100 || nextY + nextH > 100) return;
            }

            // Min size limit
            if (nextW >= 10 && nextH >= 10) {
                setCropBox({ x: nextX, y: nextY, w: nextW, h: nextH });
            }
        }
    };

    const stopAction = () => {
        isDragging.current = false;
        isResizing.current = null;
    };

    useEffect(() => {
        window.addEventListener('mousemove', doAction);
        window.addEventListener('mouseup', stopAction);
        window.addEventListener('touchmove', doAction);
        window.addEventListener('touchend', stopAction);
        return () => {
            window.removeEventListener('mousemove', doAction);
            window.removeEventListener('mouseup', stopAction);
            window.removeEventListener('touchmove', doAction);
            window.removeEventListener('touchend', stopAction);
        };
    }, [cropBox, aspectPreset]);

    const handleCrop = () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'image-cropper'
        });
        if (!file || !previewUrl || !imageRef.current) return;

        setLoading(true);
        try {
            const img = imageRef.current;
            
            // Calculate pixel dimensions relative to original image size
            // imageRef.current holds the loaded dimensions, naturalWidth/naturalHeight are raw pixels
            const naturalW = img.naturalWidth;
            const naturalH = img.naturalHeight;

            const pxX = (cropBox.x / 100) * naturalW;
            const pxY = (cropBox.y / 100) * naturalH;
            const pxW = (cropBox.w / 100) * naturalW;
            const pxH = (cropBox.h / 100) * naturalH;

            const canvas = document.createElement('canvas');
            canvas.width = pxW;
            canvas.height = pxH;

            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not initialize canvas context');

            const sourceImg = new Image();
            sourceImg.onload = () => {
                ctx.drawImage(sourceImg, pxX, pxY, pxW, pxH, 0, 0, pxW, pxH);
                const croppedUrl = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = croppedUrl;
                link.download = `cropped_${file.name}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showToast('Image cropped successfully!', 'success');
                setLoading(false);
            };
            sourceImg.src = previewUrl;

        } catch (e: any) {
            showToast(e.message || 'Crop processing failed', 'error');
            setLoading(false);
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Image Cropper Tools",
        "description": "Crop and cut your images online client-side. Aspect ratio templates, fully adjustable crop boxes with visual handles.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/image-cropper`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <SEO 
                title="Image Cropper Tools" 
                description="Crop and cut your images online client-side. Aspect ratio templates, fully adjustable crop boxes with visual handles." 
                canonical="/image-cropper"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Image Cropper</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Drag, adjust, and crop your images instantly. 100% private execution inside your browser.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Frame: Live interactive crop overlay */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <Card variant="elevated" className="p-6 h-full flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden select-none">
                            {previewUrl ? (
                                <div 
                                    ref={containerRef}
                                    className="relative max-h-[420px] max-w-full border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden bg-slate-950/40 cursor-crosshair"
                                    style={{ display: 'inline-block' }}
                                >
                                    <img 
                                        ref={imageRef} 
                                        src={previewUrl} 
                                        alt="Crop Source" 
                                        loading="lazy"
                                        className="max-h-[400px] object-contain block"
                                        draggable="false"
                                    />
                                    
                                    {/* Crop overlay cutout and handles */}
                                    <div 
                                        className="absolute border border-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-black/30 backdrop-blur-[0.5px]"
                                        style={{
                                            left: `${cropBox.x}%`,
                                            top: `${cropBox.y}%`,
                                            width: `${cropBox.w}%`,
                                            height: `${cropBox.h}%`
                                        }}
                                    >
                                        {/* Drag Box Area */}
                                        <div 
                                            onMouseDown={(e) => startAction('move', e)}
                                            onTouchStart={(e) => startAction('move', e)}
                                            className="w-full h-full cursor-move flex items-center justify-center opacity-30 group"
                                        >
                                            <Move size={20} className="text-indigo-200 group-hover:scale-110 transition-all" />
                                        </div>

                                        {/* Drag Corner Handles */}
                                        <div 
                                            onMouseDown={(e) => startAction('tl', e)}
                                            onTouchStart={(e) => startAction('tl', e)}
                                            className="absolute w-3.5 h-3.5 -top-1.5 -left-1.5 bg-indigo-500 border border-white rounded-full cursor-nwse-resize"
                                        />
                                        <div 
                                            onMouseDown={(e) => startAction('tr', e)}
                                            onTouchStart={(e) => startAction('tr', e)}
                                            className="absolute w-3.5 h-3.5 -top-1.5 -right-1.5 bg-indigo-500 border border-white rounded-full cursor-nesw-resize"
                                        />
                                        <div 
                                            onMouseDown={(e) => startAction('bl', e)}
                                            onTouchStart={(e) => startAction('bl', e)}
                                            className="absolute w-3.5 h-3.5 -bottom-1.5 -left-1.5 bg-indigo-500 border border-white rounded-full cursor-nesw-resize"
                                        />
                                        <div 
                                            onMouseDown={(e) => startAction('br', e)}
                                            onTouchStart={(e) => startAction('br', e)}
                                            className="absolute w-3.5 h-3.5 -bottom-1.5 -right-1.5 bg-indigo-500 border border-white rounded-full cursor-nwse-resize"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                                        <Crop size={40} className="text-emerald-400" />
                                    </div>
                                    <p className="text-xl font-semibold mb-2">Upload Photo to Crop</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                                        Support JPG, PNG, and WEBP formats. Crop instantly with visual dimensions.
                                    </p>
                                    <Button onClick={() => fileInputRef.current?.click()} size="lg">
                                        Choose File
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

                    {/* Right Panel: Presets & Controls */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {file ? (
                            <Card variant="elevated" className="p-6 space-y-6 flex flex-col justify-between h-full">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-200 border-b border-white/5 pb-2 flex items-center gap-2">
                                        <Ratio size={18} className="text-emerald-400" />
                                        Crop Presets
                                    </h3>

                                    {/* Aspect Ratio Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { key: 'free', label: 'Free Aspect', desc: 'Custom boundaries' },
                                            { key: '1:1', label: 'Square 1:1', desc: 'Avatar / Profile' },
                                            { key: '16:9', label: 'Wide 16:9', desc: 'Youtube / Presentation' },
                                            { key: '4:3', label: 'Classic 4:3', desc: 'Retro Photo' }
                                        ].map(preset => (
                                            <button
                                                key={preset.key}
                                                onClick={() => setAspectPreset(preset.key as any)}
                                                className={`p-3 rounded-xl border text-left transition-all ${aspectPreset === preset.key ? 'border-emerald-500 bg-emerald-500/5 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-white/10 hover:border-white/20 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300'}`}
                                            >
                                                <span className="text-xs font-bold font-mono block">{preset.label}</span>
                                                <span className="text-[10px] text-gray-600 dark:text-gray-400 block mt-0.5">{preset.desc}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Interactive instruction box */}
                                    <div className="p-3 bg-gray-100 dark:bg-white/5 border border-white/5 rounded-xl text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">How to Crop:</p>
                                        1. Click and drag the <span className="font-bold text-emerald-400">Center Compass icon</span> to reposition the crop window.<br />
                                        2. Drag the <span className="font-bold text-emerald-400">corner circle handles</span> to scale boundaries.
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6 border-t border-white/5">
                                    <Button variant="ghost" onClick={() => setFile(null)} className="w-1/3">
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={handleCrop}
                                        loading={loading}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex-grow text-sm py-3"
                                    >
                                        Crop & Download
                                        <Crop size={16} className="ml-2" />
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card variant="elevated" className="p-8 flex flex-col items-center justify-center text-center h-full text-gray-500 dark:text-gray-500">
                                <Crop size={48} className="opacity-10 mb-3" />
                                <p className="text-base font-semibold">Cropping Presets</p>
                                <p className="text-xs text-gray-600 mt-1">Aspect ratio configurations, square sizing, and action crop buttons will show up here.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        
            <ToolSEOContent toolName="Image Cropper Tools" toolDescription="Crop and cut your images online client-side. Aspect ratio templates, fully adjustable crop boxes with visual handles." />
        </div>
    );
}
