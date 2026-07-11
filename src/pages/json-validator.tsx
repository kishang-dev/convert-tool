import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuShieldCheck as ShieldCheck, LuCircleAlert as AlertCircle, LuSparkles as Sparkles, LuCircleCheck as CheckCircle2, LuChevronRight as ChevronRight } from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function JsonValidator() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorPos, setErrorPos] = useState<{ line?: number; column?: number; char?: string }>({});
    const [metrics, setMetrics] = useState<{
        sizeBytes: number;
        keysCount: number;
        maxDepth: number;
        type: 'Object' | 'Array' | 'Primitive';
    } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const calculateDepth = (obj: any): number => {
        if (obj === null || typeof obj !== 'object') return 0;
        let max = 0;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                max = Math.max(max, calculateDepth(obj[key]));
            }
        }
        return 1 + max;
    };

    const countKeys = (obj: any): number => {
        if (obj === null || typeof obj !== 'object') return 0;
        let count = 0;
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                count += countKeys(item);
            });
        } else {
            const keys = Object.keys(obj);
            count += keys.length;
            keys.forEach(key => {
                count += countKeys(obj[key]);
            });
        }
        return count;
    };

    const handleValidate = () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'json-validator'
        });
        if (!input.trim()) {
            showToast('Please enter some JSON to validate', 'error');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            setStatus('valid');
            setErrorMsg('');
            setErrorPos({});

            // Calculate metrics
            const depth = calculateDepth(parsed);
            const totalKeys = countKeys(parsed);
            const type = Array.isArray(parsed) ? 'Array' : (typeof parsed === 'object' ? 'Object' : 'Primitive');

            setMetrics({
                sizeBytes: new Blob([input]).size,
                keysCount: totalKeys,
                maxDepth: depth,
                type
            });

            showToast('JSON is 100% Valid!', 'success');
        } catch (error: any) {
            console.error(error);
            setStatus('invalid');
            setErrorMsg(error.message);

            // Attempt to parse line/column numbers from JS JSON.parse error message
            // Example: "Unexpected token } in JSON at position 134" or "JSON.parse: unexpected character at line 4 column 5 of the JSON data"
            const positionMatch = error.message.match(/position (\d+)/i);
            const lineColMatch = error.message.match(/line (\d+) column (\d+)/i);
            
            let line = undefined;
            let column = undefined;

            if (lineColMatch) {
                line = parseInt(lineColMatch[1]);
                column = parseInt(lineColMatch[2]);
            } else if (positionMatch) {
                const pos = parseInt(positionMatch[1]);
                // Compute line & column from raw position index
                const substring = input.substring(0, pos);
                const lines = substring.split('\n');
                line = lines.length;
                column = lines[lines.length - 1].length + 1;
            }

            setErrorPos({
                line,
                column,
                char: input.charAt(positionMatch ? parseInt(positionMatch[1]) : 0) || undefined
            });

            showToast('Syntax error found in JSON!', 'error');
        }
    };

    const handleLoadSample = () => {
        const invalidSample = `{
  "name": "Invalid Sample",
  "missing_quote: true,
  "nested": {
    "list": [1, 2, 3]
  }
}`;
        setInput(invalidSample);
        setStatus('idle');
        setMetrics(null);
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JSON Validator & Syntax Debugger Tools",
        "description": "Validate your JSON codes instantly, analyze object depth, and discover exact syntax error lines.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/json-validator`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="JSON Validator & Syntax Debugger Tools" 
                description="Validate your JSON codes instantly, analyze object depth, and discover exact syntax error lines." 
                canonical="/json-validator"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'JSON Validator', href: '/json-validator' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Validator & Debugger</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Validate JSON structure, detect syntax formatting anomalies, and find line-by-line debugging indices.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Input */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-6 h-full bg-[var(--surface)] border-[var(--border)]">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-[var(--text)]">
                                    JSON Input
                                </h2>
                                <Button 
                                    onClick={handleLoadSample} 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-xs text-[var(--accent)] hover:text-indigo-300"
                                >
                                    <Sparkles size={14} className="mr-1" />
                                    Load Broken Sample
                                </Button>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Paste your JSON payload here...'
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[400px] leading-relaxed"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button 
                                    onClick={() => setInput('')} 
                                    variant="ghost"
                                    className="text-[var(--text-muted)] hover:text-[var(--text)]"
                                >
                                    Clear
                                </Button>
                                <Button 
                                    onClick={handleValidate}
                                    className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                                >
                                    Validate JSON
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Validation Panel */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {status === 'idle' && (
                            <Card variant="elevated" className="p-8 flex flex-col items-center justify-center text-center h-full text-[var(--text-faint)] dark:text-[var(--text-faint)]">
                                <ShieldCheck size={48} className="opacity-10 mb-3" />
                                <p className="text-base font-semibold">Ready for validation</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">Paste JSON on the left and click "Validate JSON" to run tests.</p>
                            </Card>
                        )}

                        {status === 'valid' && metrics && (
                            <div className="flex flex-col gap-6 h-full">
                                {/* Success Status */}
                                <Card variant="elevated" className="border-green-500/30 bg-green-500/5 p-6 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle2 size={36} className="text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-400 mb-1">Valid JSON Structure</h3>
                                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">All characters align cleanly to the JSON standard specs.</p>
                                </Card>

                                {/* Object Metrics */}
                                <Card variant="elevated" className="p-6 flex-grow">
                                    <h4 className="text-sm font-bold tracking-wider text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase mb-4">Document Metrics</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Root Type</span>
                                            <span className="font-mono text-sm font-bold text-[var(--accent)]">{metrics.type}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Payload Size</span>
                                            <span className="font-mono text-sm font-semibold">{metrics.sizeBytes} bytes</span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
                                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Maximum Nesting Depth</span>
                                            <span className="font-mono text-sm font-semibold text-emerald-400">{metrics.maxDepth}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Total Keys/Elements</span>
                                            <span className="font-mono text-sm font-semibold text-[var(--accent)]">{metrics.keysCount}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {status === 'invalid' && (
                            <div className="flex flex-col gap-6 h-full">
                                {/* Error Header */}
                                <Card variant="elevated" className="border-red-500/30 bg-red-500/5 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-500/10 rounded text-red-400 mt-1 shrink-0">
                                            <AlertCircle size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-red-400 text-lg mb-1">Invalid JSON Structure</h3>
                                            <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] leading-relaxed">A parsing syntax error was detected in the document schema.</p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Syntax Details */}
                                <Card variant="elevated" className="p-6 flex-grow">
                                    <h4 className="text-sm font-bold tracking-wider text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase mb-4">Error Details</h4>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-[var(--surface)] dark:bg-[var(--surface-hover)] border border-[var(--border)] rounded font-mono text-xs text-red-400 leading-relaxed">
                                            {errorMsg}
                                        </div>
                                        
                                        {(errorPos.line !== undefined || errorPos.column !== undefined) && (
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="p-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded">
                                                    <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] block mb-0.5">LINE NUMBER</span>
                                                    <span className="font-mono text-lg font-bold text-red-400">{errorPos.line}</span>
                                                </div>
                                                <div className="p-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded">
                                                    <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] block mb-0.5">COLUMN INDEX</span>
                                                    <span className="font-mono text-lg font-bold text-red-400">{errorPos.column}</span>
                                                </div>
                                            </div>
                                        )}

                                        {errorPos.char && (
                                            <div className="p-3.5 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded flex items-center justify-between">
                                                <span className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)]">FAILLING CHARACTER</span>
                                                <span className="font-mono text-base font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">"{errorPos.char}"</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        
            <ToolSEOContent toolName="JSON Validator & Syntax Debugger Tools" toolDescription="Validate your JSON codes instantly, analyze object depth, and discover exact syntax error lines." />
            <Footer />
        </div>
    );
}
