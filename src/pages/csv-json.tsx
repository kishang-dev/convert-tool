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
    LuTable as TableIcon,
    LuSettings as SettingsIcon,
    LuListFilter as FilterIcon
} from "react-icons/lu";
import api from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

export default function CsvJsonConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Advanced Delimiter options
    const [delimiter, setDelimiter] = useState<',' | ';' | '\t' | 'custom'>(',');
    const [customDelimiter, setCustomDelimiter] = useState('');
    const [prettyJson, setPrettyJson] = useState(true);
    
    // Interactive Grid Preview State
    const [previewHeaders, setPreviewHeaders] = useState<string[]>([]);
    const [previewRows, setPreviewRows] = useState<string[][]>([]);
    const [showGrid, setShowGrid] = useState(false);

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
        setPreviewHeaders([]);
        setPreviewRows([]);
        setShowGrid(false);
    };

    const handleToggleDirection = () => {
        setDirection(prev => prev === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
        setInput(output);
        setOutput(input);
        setPreviewHeaders([]);
        setPreviewRows([]);
        setShowGrid(false);
    };

    const getActiveDelimiter = () => {
        if (delimiter === 'custom') return customDelimiter || ',';
        if (delimiter === '\t') return '\t';
        return delimiter;
    };

    const parseCsvToGrid = (csvText: string, delim: string) => {
        try {
            const lines = csvText.split(/\r?\n/).filter(line => line.trim());
            if (lines.length === 0) return;
            
            const rows = lines.map(line => {
                // Simple split regex that respects quotes to protect nested delimiters
                const matches = line.match(/(".*?"|[^",\t;]+)(?=\s*,|\s*\t|\s*;|\s*$)/g) || line.split(delim);
                return matches.map(val => val.replace(/^"|"$/g, '').trim());
            });

            if (rows.length > 0) {
                setPreviewHeaders(rows[0]);
                setPreviewRows(rows.slice(1));
            }
        } catch (e) {
            console.error("Failed to parse CSV to Grid", e);
        }
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
        const delim = getActiveDelimiter();
        try {
            if (direction === 'csv-to-json') {
                // Parse and build JSON client-side with delimiter option
                const lines = input.split(/\n/).map(l => l.trim()).filter(Boolean);
                if (lines.length < 2) {
                    showToast('Invalid CSV format. Need headers and at least 1 data row.', 'error');
                    setLoading(false);
                    return;
                }
                const headers = lines[0].split(delim).map(h => h.trim());
                const result = [];
                for (let i = 1; i < lines.length; i++) {
                    const obj: any = {};
                    const currentLine = lines[i].split(delim).map(c => c.trim());
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j] || `column_${j}`] = currentLine[j] || '';
                    }
                    result.push(obj);
                }
                const jsonResult = prettyJson ? JSON.stringify(result, null, 2) : JSON.stringify(result);
                setOutput(jsonResult);
                parseCsvToGrid(input, delim);
                showToast('Converted to JSON successfully!', 'success');
            } else {
                // Parse JSON array and build CSV client-side
                const jsonArray = JSON.parse(input);
                if (!Array.isArray(jsonArray)) {
                    throw new Error("Input must be a valid JSON Array");
                }
                if (jsonArray.length === 0) {
                    showToast('Empty JSON Array.', 'error');
                    setLoading(false);
                    return;
                }
                const headers = Object.keys(jsonArray[0]);
                const csvRows = [headers.join(delim)];
                for (const row of jsonArray) {
                    const values = headers.map(header => {
                        const val = row[header] === undefined || row[header] === null ? '' : row[header];
                        const strVal = String(val);
                        // Escape quotes and wrap in quotes if contains delimiter
                        if (strVal.includes(delim) || strVal.includes('"') || strVal.includes('\n')) {
                            return `"${strVal.replace(/"/g, '""')}"`;
                        }
                        return strVal;
                    });
                    csvRows.push(values.join(delim));
                }
                const csvResult = csvRows.join('\n');
                setOutput(csvResult);
                parseCsvToGrid(csvResult, delim);
                showToast('Converted to CSV successfully!', 'success');
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.message || 'Conversion failed. Please verify your input syntax.', 'error');
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

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: direction === 'csv-to-json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = direction === 'csv-to-json' ? 'converted.json' : 'converted.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Download started!', 'success');
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

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'CSV ↔ JSON Converter', href: '/csv-json' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">CSV ↔ JSON Converter Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Convert CSV spreadsheets to structured JSON arrays, parse custom delimiters, and preview your data interactively.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Settings Panel */}
                <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-6 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Direction Toggle */}
                        <Button 
                            onClick={handleToggleDirection} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-teal-400">{direction === 'csv-to-json' ? 'CSV ➔ JSON' : 'JSON ➔ CSV'}</span>
                        </Button>

                        {/* Delimiter Selection */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold uppercase tracking-wider text-[var(--text-muted)]">Delimiter:</span>
                            <select
                                value={delimiter}
                                onChange={(e: any) => setDelimiter(e.target.value)}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] rounded px-2 py-1 text-sm focus:outline-none"
                            >
                                <option value=",">Comma (,)</option>
                                <option value=";">Semicolon (;)</option>
                                <option value="\t">Tab</option>
                                <option value="custom">Custom</option>
                            </select>
                            {delimiter === 'custom' && (
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={customDelimiter}
                                    onChange={(e) => setCustomDelimiter(e.target.value)}
                                    placeholder="char"
                                    className="w-12 bg-[var(--bg)] border border-[var(--border-strong)] rounded px-2 py-1 text-sm text-center focus:outline-none"
                                />
                            )}
                        </div>

                        {/* Formats Checkbox */}
                        {direction === 'csv-to-json' && (
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
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* File Upload Button */}
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

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[450px] bg-[var(--surface)] border-[var(--border)]">
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
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[450px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Output {direction === 'csv-to-json' ? 'JSON' : 'CSV'}
                            </span>
                            {output && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1.5 rounded bg-blue-500/10 transition-all border border-blue-500/20"
                                    >
                                        <Download size={14} />
                                        Download
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium px-2.5 py-1.5 rounded bg-teal-500/10 transition-all border border-teal-500/20"
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
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>
                </div>

                {/* Dynamic Data Table Grid Preview */}
                {previewHeaders.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-teal-400">
                                <TableIcon size={20} />
                                Interactive Grid Preview
                            </h2>
                            <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => setShowGrid(!showGrid)}
                            >
                                {showGrid ? 'Hide Preview' : 'Show Preview'}
                            </Button>
                        </div>

                        {showGrid && (
                            <Card className="p-4 bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                                <table className="w-full border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--border-strong)] bg-[var(--bg)]">
                                            {previewHeaders.map((header, idx) => (
                                                <th key={idx} className="p-3 font-semibold text-[var(--accent)] uppercase tracking-wider text-xs">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRows.map((row, rowIdx) => (
                                            <tr key={rowIdx} className="border-b border-[var(--border-strong)]/30 hover:bg-[var(--bg)]/50 transition-colors">
                                                {row.map((cell, cellIdx) => (
                                                    <td key={cellIdx} className="p-3 text-[var(--text-muted)] font-mono text-xs max-w-xs truncate">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        
            <ToolSEOContent toolName="CSV ↔ JSON Converter Tools" toolDescription="Convert CSV spreadsheets to JSON format and JSON arrays back to CSV tables instantly." />
            <Footer />
        </div>
    );
}
