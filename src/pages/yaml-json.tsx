import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { ArrowLeftRight, Copy, Trash2, Upload, FileJson, Check, ArrowRightLeft } from 'lucide-react';
import api from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

export default function YamlJsonConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [direction, setDirection] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json');
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
        setDirection(prev => prev === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json');
        setInput(output);
        setOutput(input);
    };

    const handleConvert = async () => {
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
                const res = await api.post('/yaml-to-json', { yaml: input });
                setOutput(res.data.json);
                showToast('Converted to JSON successfully!', 'success');
            } else {
                const res = await api.post('/json-to-yaml', { json: input });
                setOutput(res.data.yaml);
                showToast('Converted to YAML successfully!', 'success');
            }
        } catch (error: any) {
            console.error(error);
            showToast(error.response?.data?.error || 'Conversion failed. Check your input syntax.', 'error');
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
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <SEO 
                title="YAML ↔ JSON Converter Tools" 
                description="Convert YAML documents to JSON format and JSON to YAML format in real-time." 
                canonical="/yaml-json"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">YAML ↔ JSON Converter</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Quickly and securely convert YAML files to standard JSON format, and JSON keys back to YAML format.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Button 
                            onClick={handleToggleDirection} 
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftRight size={16} />
                            Mode: <span className="font-bold text-blue-400">{direction === 'yaml-to-json' ? 'YAML ➔ JSON' : 'JSON ➔ YAML'}</span>
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white"
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
                            className="bg-blue-600 hover:bg-blue-500 font-bold"
                        >
                            Convert
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Input {direction === 'yaml-to-json' ? 'YAML' : 'JSON'}
                            </span>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={direction === 'yaml-to-json' ? 
`# Paste your YAML here
server:
  port: 8080
  host: localhost
database:
  driver: mongodb
  enabled: true` : 
`{
  "server": {
    "port": 8080,
    "host": "localhost"
  },
  "database": {
    "driver": "mongodb",
    "enabled": true
  }
}`}
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-blue-500/40 resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-4 md:p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Output {direction === 'yaml-to-json' ? 'JSON' : 'YAML'}
                            </span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-blue-500/10 transition-all"
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
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[400px] leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        
            <ToolSEOContent toolName="YAML ↔ JSON Converter Tools" toolDescription="Convert YAML documents to JSON format and JSON to YAML format in real-time." />
        </div>
    );
}
