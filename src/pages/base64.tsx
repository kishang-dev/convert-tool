import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { ArrowLeftRight, Copy, Trash2, Upload, File, Check, Download } from 'lucide-react';
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function Base64Tool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    const handleToggleMode = () => {
        setMode(prev => prev === 'encode' ? 'decode' : 'encode');
        setInput(output);
        setOutput(input);
    };

    const handleProcess = async () => {
        if (!input.trim()) {
            showToast('Please enter some text first', 'error');
            return;
        }

        try {
            if (mode === 'encode') {
                const res = await devToolsAPI.base64Encode(input);
                setOutput(res.result);
                showToast('Text encoded to Base64!', 'success');
            } else {
                const res = await devToolsAPI.base64Decode(input.trim());
                setOutput(res.result);
                showToast('Base64 decoded successfully!', 'success');
            }

            // Track tool usage event
            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: `base64-${mode}`,
            });
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Failed to process. Check if input is a valid Base64 string.', 'error');
        }
    };

    // File to Base64
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // FileReader.readAsDataURL returns "data:*/*;base64,....."
                // Extract only the raw base64 part
                const base64Data = result.split(',')[1] || result;
                setOutput(base64Data);
                setInput(`[File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`);
                setMode('encode');
                showToast(`Converted ${file.name} to Base64!`, 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    // Base64 to Binary Download
    const handleDownloadBinary = () => {
        if (!output.trim()) return;
        try {
            const byteCharacters = atob(output.trim().replace(/\s/g, ''));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'decoded_file.bin';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast('File downloaded successfully!', 'success');
        } catch (e) {
            showToast('Unable to parse output as a valid binary file', 'error');
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
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <SEO 
                title="Base64 Encoder & Decoder Tools" 
                description="Encode strings/files to Base64 or decode Base64 strings back to text instantly." 
                canonical="/base64"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Base64 Encoder & Decoder</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Encode plain text and files to Base64, or decode base64 representations back to string text or downloads.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleToggleMode} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-indigo-400">{mode === 'encode' ? 'Encode Text' : 'Decode Base64'}</span>
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white"
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
                        <Button
                            onClick={handleProcess}
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold"
                        >
                            {mode === 'encode' ? 'Encode' : 'Decode'}
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Input {mode === 'encode' ? 'Text' : 'Base64'}
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 
`Type or paste plain text here to encode...` : 
`Paste Base64 string here to decode...`}
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Result
                            </span>
                            {output && (
                                <div className="flex items-center gap-2">
                                    {mode === 'encode' ? null : (
                                        <button
                                            onClick={handleDownloadBinary}
                                            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 transition-all mr-1"
                                        >
                                            <Download size={14} />
                                            Download File
                                        </button>
                                    )}
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 transition-all"
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
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-indigo-400 focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        
            <ToolSEOContent toolName="Base64 Encoder & Decoder Tools" toolDescription="Encode strings/files to Base64 or decode Base64 strings back to text instantly." />
        </div>
    );
}
