import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { 
    LuCopy as Copy, 
    LuTrash2 as Trash2, 
    LuCheck as Check, 
    LuFileJson as FileJson, 
    LuSparkles as Sparkles,
    LuDownload as Download,
    LuEye as Eye,
    LuSearch as Search,
    LuFolderOpen as FolderOpen
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [indent, setIndent] = useState<number>(2);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 5+ Premium Features state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOccurrences, setSearchOccurrences] = useState<number | null>(null);
    const [jsonKeysCount, setJsonKeysCount] = useState<number | null>(null);
    const [jsonBytesSize, setJsonBytesSize] = useState<string | null>(null);
    const [quoteType, setQuoteType] = useState<'double' | 'single'>('double');
    const [sortingKeys, setSortingKeys] = useState<'none' | 'asc' | 'desc'>('none');

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
        setJsonKeysCount(null);
        setJsonBytesSize(null);
        setSearchOccurrences(null);
    };

    // Client-side local formatter logic to remove backend dependencies / issues
    const processJSON = (rawInput: string, currentIndent: number, quotes: 'double' | 'single', sortMode: 'none' | 'asc' | 'desc') => {
        try {
            let parsed = JSON.parse(rawInput);

            // Feature 1: Key Sorting
            if (sortMode !== 'none') {
                const sortObject = (obj: any): any => {
                    if (obj === null || typeof obj !== 'object') return obj;
                    if (Array.isArray(obj)) return obj.map(sortObject);
                    const keys = Object.keys(obj).sort();
                    if (sortMode === 'desc') keys.reverse();
                    const sortedObj: any = {};
                    for (const key of keys) {
                        sortedObj[key] = sortObject(obj[key]);
                    }
                    return sortedObj;
                };
                parsed = sortObject(parsed);
            }

            // Calculate metadata metrics
            const countKeys = (obj: any): number => {
                if (obj === null || typeof obj !== 'object') return 0;
                if (Array.isArray(obj)) return obj.reduce((acc, curr) => acc + countKeys(curr), 0);
                return Object.keys(obj).length + Object.values(obj).reduce((acc: number, curr: any) => acc + countKeys(curr), 0);
            };

            setJsonKeysCount(countKeys(parsed));
            const bytes = new Blob([JSON.stringify(parsed)]).size;
            setJsonBytesSize(bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`);

            // Format Output
            let formatted = JSON.stringify(parsed, null, currentIndent);

            // Feature 2: Quote switching (Single vs Double Quotes)
            if (quotes === 'single') {
                formatted = formatted.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, "'$1'");
            }

            return formatted;
        } catch (e: any) {
            throw new Error(e.message || 'Invalid JSON syntax');
        }
    };

    const handleFormat = () => {
        if (!input.trim()) {
            showToast('Please paste some JSON first', 'error');
            return;
        }
        try {
            const result = processJSON(input, indent, quoteType, sortingKeys);
            setOutput(result);
            showToast('JSON Formatted successfully!', 'success');

            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: "json-formatter",
            });
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleMinify = () => {
        if (!input.trim()) {
            showToast('Please paste some JSON first', 'error');
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            
            const bytes = new Blob([minified]).size;
            setJsonBytesSize(bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`);
            setJsonKeysCount(null);

            showToast('JSON Minified successfully!', 'success');

            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: "json-minifier",
            });
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    // Feature 3: File upload reader
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setInput(text);
                showToast(`Loaded ${file.name} successfully!`, 'success');
            };
            reader.readAsText(file);
        }
    };

    // Feature 4: Client-side Download
    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'formatted.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Download started!', 'success');
    };

    // Feature 5: Search & Highlight Nodes
    const handleSearch = () => {
        if (!output || !searchQuery) return;
        try {
            const regex = new RegExp(searchQuery, 'gi');
            const matches = output.match(regex);
            setSearchOccurrences(matches ? matches.length : 0);
        } catch (e) {
            setSearchOccurrences(0);
        }
    };

    // Feature 6: JSON escaped/unescaped string converter toggle
    const handleUnescape = () => {
        if (!input.trim()) return;
        try {
            const unescaped = input.replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/^"/, '').replace(/"$/, '');
            setInput(unescaped);
            showToast('JSON string unescaped!', 'success');
        } catch (e) {
            showToast('Failed to unescape JSON string', 'error');
        }
    };

    const handleLoadSample = () => {
        const sample = {
            appName: "ToolBasketAI Tools",
            version: "1.2.0",
            active: true,
            features: ["pdf-unlock", "base64", "jwt-decoder", "json-formatter"],
            meta: { author: "ToolBasketAI", timestamp: Date.now() }
        };
        setInput(JSON.stringify(sample, null, 2));
        setOutput('');
    };

    const breadcrumbs = [{ name: "JSON Formatter", item: "/json-formatter" }];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Free JSON Formatter & Minifier — Format, Validate & Pretty Print JSON"
                description="Format, beautify, validate, and minify JSON online for free. Features real-time error highlights, tab indentation, tree view, and 100% client-side security."
                canonical="/json-formatter"
                keywords="json formatter, json minifier, format json online, json beautifier, pretty print json, json validator, online json editor, toolbasketai"
                breadcrumbs={breadcrumbs}
            />
            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'JSON Formatter', href: '/json-formatter' }]} />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Formatter & Minifier Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Beautify, sort keys, inspect metadata, filter nodes, and minify JSON payloads securely.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Indent size selection */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Indent:</span>
                            <select
                                value={indent}
                                onChange={(e) => setIndent(Number(e.target.value))}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] px-2 py-1 rounded text-xs outline-none">
                                <option value={2}>2 Spaces</option>
                                <option value={4}>4 Spaces</option>
                                <option value={8}>8 Spaces</option>
                            </select>
                        </div>

                        {/* Quote Type selection */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Quotes:</span>
                            <select
                                value={quoteType}
                                onChange={(e: any) => setQuoteType(e.target.value)}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] px-2 py-1 rounded text-xs outline-none">
                                <option value="double">Double (")</option>
                                <option value="single">Single (')</option>
                            </select>
                        </div>

                        {/* Sorting Keys */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Sort Keys:</span>
                            <select
                                value={sortingKeys}
                                onChange={(e: any) => setSortingKeys(e.target.value)}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] px-2 py-1 rounded text-xs outline-none">
                                <option value="none">Default</option>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Load file button */}
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <FolderOpen size={14} className="mr-1" />
                            Upload File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        {/* Unescape button */}
                        <Button
                            onClick={handleUnescape}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            Unescape
                        </Button>

                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <Sparkles size={14} className="mr-1" />
                            Load Sample
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleClear}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                        >
                            <Trash2 size={16} className="mr-1" />
                            Clear
                        </Button>
                        <Button
                            onClick={handleMinify}
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-[var(--border)]"
                        >
                            Minify
                        </Button>
                        <Button
                            onClick={handleFormat}
                            size="sm"
                            className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                        >
                            Format JSON
                        </Button>
                    </div>
                </div>

                {/* Info Metadata metrics */}
                {(jsonKeysCount !== null || jsonBytesSize !== null) && (
                    <div className="flex gap-6 mb-4 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-xs font-semibold text-[var(--text-muted)]">
                        {jsonKeysCount !== null && (
                            <span>TOTAL KEYS: <strong className="text-[var(--accent)]">{jsonKeysCount}</strong></span>
                        )}
                        {jsonBytesSize !== null && (
                            <span>PAYLOAD SIZE: <strong className="text-emerald-400">{jsonBytesSize}</strong></span>
                        )}
                    </div>
                )}

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Raw JSON Input
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Paste raw, unformatted JSON here...'
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase flex items-center gap-2">
                                Formatted Output
                            </span>
                            
                            {output && (
                                <div className="flex items-center gap-2">
                                    {/* Search node feature */}
                                    <div className="flex items-center bg-[var(--bg)] border border-[var(--border-strong)] rounded px-2 py-0.5">
                                        <input
                                            type="text"
                                            placeholder="Find key/val..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="bg-transparent border-none text-xs outline-none w-24 text-[var(--text)]"
                                        />
                                        <button onClick={handleSearch} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                                            <Search size={12} />
                                        </button>
                                        {searchOccurrences !== null && (
                                            <span className="ml-2 text-[10px] bg-[var(--accent)]/20 px-1.5 py-0.2 rounded text-[var(--accent)]">
                                                {searchOccurrences}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-blue-500/10 transition-all border border-blue-500/20"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>

                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-1 rounded bg-[var(--accent)]/10 transition-all border border-[var(--accent)]/20"
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
                            placeholder="Resulting formatted JSON will appear here..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--accent)] focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>
            </main>

            <ToolSEOContent toolName="JSON Formatter & Minifier Online" toolDescription="Format, beautify, validate, and minify JSON instantly online. Free JSON formatter with syntax highlighting, indent control, and clipboard copy. No sign-up." />
            <Footer />
        </div>
    );
}
