import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuArrowLeftRight as ArrowLeftRight, LuCopy as Copy, LuTrash2 as Trash2, LuUpload as Upload, LuFileJson as FileJson, LuCheck as Check } from "react-icons/lu";
import api from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CsvJsonConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
    const [loading, setLoading] = useState(false);
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

    const handleToggleDirection = () => {
        setDirection(prev => prev === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
        setInput(output);
        setOutput(input);
    };

    const handleConvert = async () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'csv-json'
        });
        if (!input.trim()) {
            showToast('Please enter some content to convert', 'error');
            return;
        }

        setLoading(true);
        try {
            if (direction === 'csv-to-json') {
                const res = await api.post('/csv-to-json', { csv: input });
                setOutput(res.data.json);
                showToast('Converted to JSON successfully!', 'success');
            } else {
                const res = await api.post('/json-to-csv', { json: input });
                setOutput(res.data.csv);
                showToast('Converted to CSV successfully!', 'success');
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Conversion failed. Please verify your input syntax.', 'error');
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
                
                // Auto detect based on file extension
                if (file.name.endsWith('.json')) {
                    setDirection('json-to-csv');
                } else if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
                    setDirection('csv-to-json');
                }
                showToast(`Loaded ${file.name} successfully!`, 'success');
            };
            reader.readAsText(file);
        }
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "CSV ↔ JSON Converter Tools",
        "description": "Convert CSV spreadsheets to JSON format and JSON arrays back to CSV tables instantly.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/csv-json`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="CSV ↔ JSON Converter Tools" 
                description="Convert CSV spreadsheets to JSON format and JSON arrays back to CSV tables instantly." 
                canonical="/csv-json"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'CSV ↔ JSON Converter', href: '/csv-json' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">CSV ↔ JSON Converter</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Instantly convert comma-separated values (CSV) into structured JSON arrays, and JSON objects back to clean tables.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleToggleDirection} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-teal-400">{direction === 'csv-to-json' ? 'CSV ➔ JSON' : 'JSON ➔ CSV'}</span>
                        </Button>
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
                            accept=".json,.csv,.txt"
                            onChange={handleFileUpload}
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
                            onClick={handleConvert}
                            loading={loading}
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold"
                        >
                            Convert
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Input {direction === 'csv-to-json' ? 'CSV' : 'JSON'}
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={direction === 'csv-to-json' ? 
`id,name,email,role
1,Alice,alice@example.com,Developer
2,Bob,bob@example.com,Designer
3,Charlie,charlie@example.com,Product Manager` : 
`[
  {
    "id": "1",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "Developer"
  },
  {
    "id": "2",
    "name": "Bob",
    "email": "bob@example.com",
    "role": "Designer"
  }
]`}
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Output {direction === 'csv-to-json' ? 'JSON' : 'CSV'}
                            </span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium px-2 py-1 rounded bg-teal-500/10 transition-all"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
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
        
            <ToolSEOContent toolName="CSV ↔ JSON Converter Tools" toolDescription="Convert CSV spreadsheets to JSON format and JSON arrays back to CSV tables instantly." />
            <Footer />
        </div>
    );
}
