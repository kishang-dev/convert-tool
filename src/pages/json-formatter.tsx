import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Trash2, Check, FileJson, Sparkles } from 'lucide-react';
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [indent, setIndent] = useState<number>(2);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

    const handleFormat = async () => {
        if (!input.trim()) {
            showToast('Please paste some JSON first', 'error');
            return;
        }

        try {
            const res = await devToolsAPI.formatJson(input, indent);
            setOutput(res.result);
            showToast('JSON Formatted successfully!', 'success');

            // Track tool usage event
            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: "json-formatter",
            });
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || `Invalid JSON`, 'error');
        }
    };

    const handleMinify = async () => {
        if (!input.trim()) {
            showToast('Please paste some JSON first', 'error');
            return;
        }

        try {
            const res = await devToolsAPI.minifyJson(input);
            setOutput(res.result);
            showToast('JSON Minified successfully!', 'success');

            // Track tool usage event
            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: "json-minifier",
            });
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || `Invalid JSON`, 'error');
        }
    };

    const handleLoadSample = () => {
        const sample = {
            appName: "ToolBasket Tools",
            version: "1.2.0",
            active: true,
            features: ["pdf-unlock", "base64", "jwt-decoder", "json-formatter"],
            meta: {
                author: "Antigravity AI",
                engine: "Gemini",
                timestamp: Date.now()
            }
        };
        setInput(JSON.stringify(sample));
        setOutput('');
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JSON Formatter & Minifier",
        "description": "Format, beautify, validate, and minify JSON instantly online. Free JSON formatter with syntax highlighting, indent control, and clipboard copy. No sign-up.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/json-formatter`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
            <SEO
                title="JSON Formatter & Minifier Online — Free Tool"
                description="Format, beautify, validate, and minify JSON instantly online. Free JSON formatter with syntax highlighting, indent control, and clipboard copy. No sign-up."
                canonical="/json-formatter"
                keywords="JSON formatter, JSON beautifier, JSON minifier, format JSON online, JSON validator, pretty print JSON, JSON tool"
                structuredData={structuredData}
            />
            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Formatter & Minifier</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Beautify, inspect, and compress your JSON codes. Align structures instantly and securely.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">Indent Size:</span>
                            <select 
                                value={indent}
                                onChange={(e) => setIndent(Number(e.target.value))}
                                className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-1.5 rounded-lg text-sm text-gray-200 outline-none"
                            >
                                <option value={2} className="bg-[#0f172a]">2 Spaces</option>
                                <option value={4} className="bg-[#0f172a]">4 Spaces</option>
                                <option value={8} className="bg-[#0f172a]">8 Spaces</option>
                            </select>
                        </div>
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white"
                        >
                            <Sparkles size={16} className="mr-1.5" />
                            Load Sample
                        </Button>
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
                            onClick={handleMinify}
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-gray-200 dark:border-white/10"
                        >
                            Minify
                        </Button>
                        <Button
                            onClick={handleFormat}
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold"
                        >
                            Format JSON
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Raw JSON Input
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Paste raw, unformatted JSON here...'
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Formatted Output
                            </span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-500/10 transition-all"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Resulting formatted JSON will appear here..."
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-indigo-400 focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
