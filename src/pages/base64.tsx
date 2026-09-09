import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuArrowLeftRight as ArrowLeftRight, LuCopy as Copy, LuTrash2 as Trash2, LuUpload as Upload, LuFile as File, LuCheck as Check, LuDownload as Download, LuGlobe as Globe, LuEye as Eye, LuCode as Code, LuRefreshCw as RefreshCw } from "react-icons/lu";
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

export default function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New Features States
    const [urlSafe, setUrlSafe] = useState(false);
    const [encoding, setEncoding] = useState<'utf8' | 'ascii' | 'hex' | 'utf16'>('utf8');
    const [autoConvert, setAutoConvert] = useState(true);
    const [urlInput, setUrlInput] = useState('');
    const [loadingUrl, setLoadingUrl] = useState(false);
    const [detectedMime, setDetectedMime] = useState<string>('');

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = (textToCopy = output) => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setDetectedMime('');
        setUrlInput('');
    };

    const handleToggleMode = () => {
        setMode(prev => prev === 'encode' ? 'decode' : 'encode');
        setInput(output);
        setOutput(input);
    };

    // Helper functions for various encodings
    const stringToHex = (str: string) => {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return hex;
    };

    const hexToString = (hex: string) => {
        let str = '';
        const cleanHex = hex.replace(/\s+/g, '');
        for (let i = 0; i < cleanHex.length; i += 2) {
            str += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
        }
        return str;
    };

    const convertProcess = async (textVal: string, currentMode: 'encode' | 'decode', currentEncoding: string, isUrlSafe: boolean) => {
        if (!textVal.trim()) {
            setOutput('');
            setDetectedMime('');
            return;
        }

        try {
            if (currentMode === 'encode') {
                let textToEncode = textVal;
                
                // Preprocess encoding formats
                if (currentEncoding === 'hex') {
                    textToEncode = stringToHex(textVal);
                } else if (currentEncoding === 'utf16') {
                    const buf = new ArrayBuffer(textVal.length * 2);
                    const bufView = new Uint16Array(buf);
                    for (let i = 0; i < textVal.length; i++) {
                        bufView[i] = textVal.charCodeAt(i);
                    }
                    textToEncode = String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
                }

                // Standard encode
                let base64 = btoa(unescape(encodeURIComponent(textToEncode)));
                
                if (isUrlSafe) {
                    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                }
                setOutput(base64);
                sniffMimeType(base64);
            } else {
                let base64ToDecode = textVal.trim();
                if (isUrlSafe) {
                    base64ToDecode = base64ToDecode.replace(/-/g, '+').replace(/_/g, '/');
                    while (base64ToDecode.length % 4) {
                        base64ToDecode += '=';
                    }
                }
                
                let decoded = decodeURIComponent(escape(atob(base64ToDecode)));
                
                // Postprocess encoding formats
                if (currentEncoding === 'hex') {
                    decoded = hexToString(decoded);
                } else if (currentEncoding === 'utf16') {
                    const bytes = new Uint8Array(decoded.length);
                    for (let i = 0; i < decoded.length; i++) {
                        bytes[i] = decoded.charCodeAt(i);
                    }
                    decoded = String.fromCharCode.apply(null, Array.from(new Uint16Array(bytes.buffer)));
                }
                setOutput(decoded);
                sniffMimeType(base64ToDecode);
            }
        } catch (error: any) {
            setOutput('Error: Invalid input format or encoding schema.');
            setDetectedMime('');
        }
    };

    // Sniff MIME type based on base64 header signature
    const sniffMimeType = (b64: string) => {
        const cleanB64 = b64.trim().substring(0, 30);
        if (cleanB64.startsWith('iVBORw0KGgo')) setDetectedMime('image/png');
        else if (cleanB64.startsWith('/9j/')) setDetectedMime('image/jpeg');
        else if (cleanB64.startsWith('R0lGOD')) setDetectedMime('image/gif');
        else if (cleanB64.startsWith('UklGR')) setDetectedMime('image/webp');
        else if (cleanB64.startsWith('PHN2Zy')) setDetectedMime('image/svg+xml');
        else if (cleanB64.startsWith('SUkqA') || cleanB64.startsWith('TU0AK')) setDetectedMime('image/tiff');
        else if (cleanB64.startsWith('JVBERi')) setDetectedMime('application/pdf');
        else if (cleanB64.startsWith('SUQz') || cleanB64.startsWith('//OQ')) setDetectedMime('audio/mp3');
        else setDetectedMime('');
    };

    // Trigger calculation when input changes in Auto mode
    useEffect(() => {
        if (autoConvert) {
            convertProcess(input, mode, encoding, urlSafe);
        }
    }, [input, mode, encoding, urlSafe, autoConvert]);

    const handleProcess = () => {
        convertProcess(input, mode, encoding, urlSafe);
        // Track tool usage event
        gtag.event({
            action: "use_tool",
            category: "Tool",
            label: `base64-${mode}`,
        });
    };

    // Load URL directly
    const handleLoadFromUrl = async () => {
        if (!urlInput.trim()) {
            showToast('Please enter a valid URL', 'error');
            return;
        }
        setLoadingUrl(true);
        try {
            const response = await fetch(urlInput);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1] || result;
                setOutput(base64Data);
                setInput(`[Loaded from URL: ${urlInput}]`);
                setMode('encode');
                setDetectedMime(blob.type);
                showToast('URL loaded and encoded successfully!', 'success');
            };
            reader.readAsDataURL(blob);
        } catch (e) {
            showToast('Failed to fetch from URL. Make sure it allows CORS.', 'error');
        } finally {
            setLoadingUrl(false);
        }
    };

    // File to Base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1] || result;
                setOutput(base64Data);
                setInput(`[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
                setMode('encode');
                setDetectedMime(file.type);
                showToast(`Converted ${file.name} to Base64!`, 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    // Base64 to Binary Download
    const handleDownloadBinary = () => {
        const b64Data = mode === 'encode' ? output : input;
        if (!b64Data.trim()) return;
        try {
            const byteCharacters = atob(b64Data.trim().replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/'));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: detectedMime || 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            const ext = detectedMime ? detectedMime.split('/')[1] : 'bin';
            link.download = `decoded_file.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('File downloaded successfully!', 'success');
        } catch (e) {
            showToast('Unable to parse base64 as binary', 'error');
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Base64 Encoder & Decoder Tools",
        "description": "Encode strings/files to Base64 or decode Base64 strings back to text instantly.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/base64`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                toolId="base64"
                title="Base64 Encoder & Decoder Online — Free Convert Text, Images & Files" 
                description="Encode plain text, images, and binary files to Base64 strings or decode Base64 back to original formats online for free. Features URL-safe Base64 options and HTML/CSS snippets." 
                canonicalUrl="https://toolbasketai.com/base64"
                keywords={[
                    "base64 encoder online",
                    "base64 decoder free",
                    "encode text to base64",
                    "base64 image decoder",
                    "url safe base64 converter",
                    "convert file to base64 string",
                    "base64 to binary converter"
                ]}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Developer Tools', item: '/#developer-tools' },
                    { name: 'Base64 Tool', item: '/base64' }
                ]}
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'Base64 Encoder/Decoder', href: '/base64' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Base64 Encoder & Decoder</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Encode plain text and files to Base64, or decode base64 representations back to string text or downloads.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* URL Loader panel */}
                <div className="mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Globe size={18} className="text-[var(--accent)]" />
                        <span className="text-sm font-semibold whitespace-nowrap">Load from URL:</span>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto flex-grow max-w-xl">
                        <input 
                            type="text" 
                            placeholder="https://example.com/image.png"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="bg-[var(--bg)] border border-[var(--border-strong)] rounded px-3 py-1.5 text-sm w-full focus:outline-none focus:border-[var(--accent)]"
                        />
                        <Button onClick={handleLoadFromUrl} size="sm" variant="secondary" className="flex items-center gap-1.5 whitespace-nowrap">
                            {loadingUrl ? <RefreshCw className="animate-spin" size={14} /> : 'Load & Encode'}
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4">
                        <Button 
                            onClick={handleToggleMode} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-[var(--accent)]">{mode === 'encode' ? 'Encode Text' : 'Decode Base64'}</span>
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <Upload size={16} className="mr-2" />
                            File to Base64
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Encoding Selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--text-muted)]">Encoding:</span>
                            <select
                                value={encoding}
                                onChange={(e: any) => setEncoding(e.target.value)}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] text-xs rounded px-2 py-1 focus:outline-none focus:border-[var(--accent)]"
                            >
                                <option value="utf8">UTF-8</option>
                                <option value="ascii">ASCII</option>
                                <option value="hex">Hexadecimal</option>
                                <option value="utf16">UTF-16</option>
                            </select>
                        </div>

                        {/* URL Safe Toggle */}
                        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={urlSafe}
                                onChange={(e) => setUrlSafe(e.target.checked)}
                                className="rounded text-[var(--accent)]"
                            />
                            <span>URL Safe</span>
                        </label>

                        {/* Auto Convert Toggle */}
                        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={autoConvert}
                                onChange={(e) => setAutoConvert(e.target.checked)}
                                className="rounded text-[var(--accent)]"
                            />
                            <span>Auto Convert</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleClear}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                        >
                            <Trash2 size={16} className="mr-1.5" />
                            Clear
                        </Button>
                        {!autoConvert && (
                            <Button
                                onClick={handleProcess}
                                size="sm"
                                className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                            >
                                {mode === 'encode' ? 'Encode' : 'Decode'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Input {mode === 'encode' ? 'Text' : 'Base64'}
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 
`Type or paste plain text here to encode...` : 
`Paste Base64 string here to decode...`}
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Result
                            </span>
                            {output && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDownloadBinary()}
                                        className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-1 rounded bg-[var(--accent)]/10 transition-all mr-1"
                                    >
                                        <Download size={14} />
                                        Download Binary
                                    </button>
                                    <button
                                        onClick={() => handleCopy()}
                                        className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-1 rounded bg-[var(--accent)]/10 transition-all"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Result will appear here..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--accent)] focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>

                {/* Previews and Snippets */}
                {output && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Live Preview Container */}
                        <Card variant="elevated" className="p-4 md:p-6 bg-[var(--surface)] border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[var(--text-muted)] uppercase">
                                <Eye size={16} />
                                <span>Live Media Preview</span>
                                {detectedMime && <span className="text-xs text-[var(--accent)] lowercase">({detectedMime})</span>}
                            </div>
                            <div className="bg-[var(--bg)] rounded border border-[var(--border-strong)] p-4 flex items-center justify-center min-h-[200px]">
                                {detectedMime.startsWith('image/') ? (
                                    <img 
                                        src={`data:${detectedMime};base64,${mode === 'encode' ? output : input}`} 
                                        alt="Preview" 
                                        className="max-h-[300px] max-w-full rounded object-contain border border-[var(--border)]"
                                    />
                                ) : detectedMime.startsWith('audio/') ? (
                                    <audio controls src={`data:${detectedMime};base64,${mode === 'encode' ? output : input}`} className="w-full" />
                                ) : (
                                    <span className="text-xs text-[var(--text-muted)]">No visual/media content detected to preview. Try converting an image file.</span>
                                )}
                            </div>
                        </Card>

                        {/* Code Snippets Generator */}
                        <Card variant="elevated" className="p-4 md:p-6 bg-[var(--surface)] border-[var(--border)]">
                            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-[var(--text-muted)] uppercase">
                                <Code size={16} />
                                <span>Use in Code (HTML / CSS URI)</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1 font-semibold">
                                        <span>HTML Image element</span>
                                        <button onClick={() => handleCopy(`<img src="data:${detectedMime || 'image/png'};base64,${mode === 'encode' ? output : input}" />`)} className="text-[var(--accent)] hover:underline">Copy tag</button>
                                    </div>
                                    <textarea 
                                        readOnly
                                        value={`<img src="data:${detectedMime || 'image/png'};base64,${mode === 'encode' ? output : input}" />`}
                                        className="w-full bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border-strong)] rounded text-xs font-mono p-2 resize-none h-16"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1 font-semibold">
                                        <span>CSS Background URI</span>
                                        <button onClick={() => handleCopy(`background-image: url("data:${detectedMime || 'image/png'};base64,${mode === 'encode' ? output : input}");`)} className="text-[var(--accent)] hover:underline">Copy rule</button>
                                    </div>
                                    <textarea 
                                        readOnly
                                        value={`background-image: url("data:${detectedMime || 'image/png'};base64,${mode === 'encode' ? output : input}");`}
                                        className="w-full bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border-strong)] rounded text-xs font-mono p-2 resize-none h-16"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </main>
        
            <ToolSEOContent toolId="base64" toolName="Base64 Encoder & Decoder Tools" toolDescription="Encode strings/files to Base64 or decode Base64 strings back to text instantly." />
            <Footer />
        </div>
    );
}

