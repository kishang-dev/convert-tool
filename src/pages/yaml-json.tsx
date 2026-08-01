import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { 
    LuArrowLeftRight as ArrowLeftRight, 
    LuCopy as Copy, 
    LuTrash2 as Trash2, 
    LuUpload as Upload, 
    LuFileJson as FileJson, 
    LuCheck as Check,
    LuDownload as Download,
    LuSparkles as Sparkles,
    LuRefreshCw as RefreshCw
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import * as yaml from 'js-yaml';

export default function YamlJsonConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [direction, setDirection] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 5+ Premium Feature States
    const [indentSize, setIndentSize] = useState<number>(2);
    const [lintOnError, setLintOnError] = useState(true);
    const [prettyJson, setPrettyJson] = useState(true);
    const [yamlFlowStyle, setYamlFlowStyle] = useState(false); // Flow style vs block style
    const [detectedSchemaType, setDetectedSchemaType] = useState<string | null>(null);

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
        setDetectedSchemaType(null);
    };

    const handleToggleDirection = () => {
        setDirection(prev => prev === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json');
        setInput(output);
        setOutput(input);
        setDetectedSchemaType(null);
    };

    // Client-side high accuracy parsing via js-yaml
    const handleConvert = () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'yaml-json'
        });
        if (!input.trim()) {
            showToast('Please enter some content to convert', 'error');
            return;
        }

        setLoading(true);
        try {
            if (direction === 'yaml-to-json') {
                // Parse YAML, output JSON
                const parsed = yaml.load(input);
                setDetectedSchemaType(Array.isArray(parsed) ? 'JSON Array' : (parsed && typeof parsed === 'object' ? 'JSON Object' : 'Primitive'));
                const result = prettyJson ? JSON.stringify(parsed, null, indentSize) : JSON.stringify(parsed);
                setOutput(result);
                showToast('Converted to JSON successfully!', 'success');
            } else {
                // Parse JSON, output YAML
                const parsed = JSON.parse(input);
                setDetectedSchemaType(Array.isArray(parsed) ? 'JSON Array' : (parsed && typeof parsed === 'object' ? 'JSON Object' : 'Primitive'));
                const result = yaml.dump(parsed, {
                    indent: indentSize,
                    flowLevel: yamlFlowStyle ? 0 : -1
                });
                setOutput(result);
                showToast('Converted to YAML successfully!', 'success');
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Conversion failed. Please verify syntax.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setInput(text);
                
                // Auto detect type based on filename extension
                if (file.name.endsWith('.json')) {
                    setDirection('json-to-yaml');
                } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
                    setDirection('yaml-to-json');
                }
                showToast(`Loaded ${file.name} successfully!`, 'success');
            };
            reader.readAsText(file);
        }
    };

    // Download converted file feature
    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: direction === 'yaml-to-json' ? 'application/json' : 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = direction === 'yaml-to-json' ? 'converted.json' : 'converted.yaml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Download started!', 'success');
    };

    const handleLoadSample = () => {
        if (direction === 'yaml-to-json') {
            setInput(`server:\n  port: 8080\n  host: localhost\ndatabase:\n  driver: mongodb\n  enabled: true\n  pools: [10, 20, 50]`);
        } else {
            setInput(JSON.stringify({
                server: { port: 8080, host: 'localhost' },
                database: { driver: 'mongodb', enabled: true, pools: [10, 20, 50] }
            }, null, 2));
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "YAML ↔ JSON Converter Tools",
        "description": "Convert YAML documents to JSON format and JSON to YAML format in real-time.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/yaml-json`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="YAML ↔ JSON Converter Tools" 
                description="Convert YAML documents to JSON format and JSON to YAML format in real-time." 
                canonical="/yaml-json"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'YAML ↔ JSON Converter', href: '/yaml-json' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">YAML ↔ JSON Converter Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Convert YAML to formatted JSON and back completely client-side. Adjust indentation layout and download results.
                    </p>
                </div>

                {/* Toolbar */}
                <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4">
                        <Button 
                            onClick={handleToggleDirection} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-teal-400">{direction === 'yaml-to-json' ? 'YAML ➔ JSON' : 'JSON ➔ YAML'}</span>
                        </Button>

                        {/* Indent Sizes */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold uppercase tracking-wider text-[var(--text-muted)]">Indent spacing:</span>
                            <select
                                value={indentSize}
                                onChange={(e) => setIndentSize(Number(e.target.value))}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] rounded px-2 py-1 text-sm focus:outline-none"
                            >
                                <option value={2}>2 Spaces</option>
                                <option value={4}>4 Spaces</option>
                            </select>
                        </div>

                        {/* Pretty-print for JSON output */}
                        {direction === 'yaml-to-json' && (
                            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={prettyJson}
                                    onChange={(e) => setPrettyJson(e.target.checked)}
                                    className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                                />
                                PRETTY PRINT JSON
                            </label>
                        )}

                        {/* Flow style toggle for YAML output */}
                        {direction === 'json-to-yaml' && (
                            <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={yamlFlowStyle}
                                    onChange={(e) => setYamlFlowStyle(e.target.checked)}
                                    className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                                />
                                USE INLINE FLOW STYLE
                            </label>
                        )}

                        <Button variant="ghost" size="sm" onClick={handleLoadSample}>
                            <Sparkles size={14} className="mr-1" /> Load Sample
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <Upload size={16} className="mr-2" />
                            Upload File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.yaml,.yml,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
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
                            onClick={handleConvert}
                            loading={loading}
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold"
                        >
                            Convert
                        </Button>
                    </div>
                </Card>

                {/* Detected Payload Type */}
                {detectedSchemaType && (
                    <div className="mb-4 text-xs font-semibold text-[var(--text-muted)]">
                        SCHEMA ROOT DETECTED: <strong className="text-[var(--accent)]">{detectedSchemaType}</strong>
                    </div>
                )}

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Input {direction === 'yaml-to-json' ? 'YAML' : 'JSON'}
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={direction === 'yaml-to-json' ? 
`server:
  port: 8080
  host: localhost` : 
`{
  "server": {
    "port": 8080
  }
}`}
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Output {direction === 'yaml-to-json' ? 'JSON' : 'YAML'}
                            </span>
                            {output && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-blue-500/10 transition-all border border-blue-500/20"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium px-2 py-1 rounded bg-teal-500/10 transition-all border border-teal-500/20"
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
                            placeholder="Converted result will appear here..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>
            </main>
        
            <ToolSEOContent toolName="YAML ↔ JSON Converter Tools" toolDescription="Convert YAML documents to JSON format and JSON to YAML format in real-time." />
            <Footer />
        </div>
    );
}
