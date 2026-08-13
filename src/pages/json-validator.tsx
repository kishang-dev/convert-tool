import React, { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { 
    LuShieldCheck as ShieldCheck, 
    LuCircleAlert as AlertCircle, 
    LuSparkles as Sparkles, 
    LuCircleCheck as CheckCircle2, 
    LuChevronRight as ChevronRight,
    LuFileCode as FileCode,
    LuDownload as Download,
    LuFolderOpen as FolderOpen,
    LuSettings as SettingsIcon,
    LuListChecks as ListChecksIcon
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

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

    // 5+ Premium features state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [schemaValidation, setSchemaValidation] = useState(false);
    const [schemaText, setSchemaText] = useState('{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" }\n  }\n}');
    const [showSchema, setShowSchema] = useState(false);
    const [strictMode, setStrictMode] = useState(false); // e.g. forbid duplicate keys
    const [customRuleKeys, setCustomRuleKeys] = useState(false); // e.g. enforce camelCase keys

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

    // Rule Validator helper
    const checkCustomRules = (obj: any): string[] => {
        const errors: string[] = [];
        const validateObj = (o: any) => {
            if (o === null || typeof o !== 'object') return;
            if (Array.isArray(o)) {
                o.forEach(validateObj);
            } else {
                Object.keys(o).forEach(k => {
                    // Feature 4: Enforce camelCase rule check
                    if (customRuleKeys && !/^[a-z][a-zA-Z0-9]*$/.test(k)) {
                        errors.push(`Key "${k}" does not follow camelCase convention.`);
                    }
                    validateObj(o[k]);
                });
            }
        };
        validateObj(obj);
        return errors;
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
            // Feature 1: Strict duplicate keys validation
            if (strictMode) {
                const keys: string[] = [];
                // Simple regex key scanner
                const matches = input.match(/"([^"]+)"\s*:/g);
                if (matches) {
                    const parsedKeys = matches.map(m => m.replace(/"/g, '').replace(/:/g, '').trim());
                    const dupes = parsedKeys.filter((item, index) => parsedKeys.indexOf(item) !== index);
                    if (dupes.length > 0) {
                        throw new Error(`Strict Mode Check Failed: Duplicate key found: "${dupes[0]}"`);
                    }
                }
            }

            const parsed = JSON.parse(input);

            // Feature 2: Custom structural rule warnings
            const ruleErrors = checkCustomRules(parsed);
            if (ruleErrors.length > 0) {
                throw new Error(`Rule convention failure: ${ruleErrors.join(', ')}`);
            }

            // Feature 3: Schema validation mock/check if toggled
            if (schemaValidation && schemaText.trim()) {
                const schema = JSON.parse(schemaText);
                if (schema.type === 'object' && Array.isArray(parsed)) {
                    throw new Error("Schema Mismatch: Expected Object root but found Array");
                }
                if (schema.properties) {
                    Object.keys(schema.properties).forEach(prop => {
                        if (schema.properties[prop].type && parsed[prop] !== undefined) {
                            if (typeof parsed[prop] !== schema.properties[prop].type) {
                                throw new Error(`Schema Mismatch: Property "${prop}" should be of type ${schema.properties[prop].type}`);
                            }
                        }
                    });
                }
            }

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

            const positionMatch = error.message.match(/position (\d+)/i);
            const lineColMatch = error.message.match(/line (\d+) column (\d+)/i);
            
            let line = undefined;
            let column = undefined;

            if (lineColMatch) {
                line = parseInt(lineColMatch[1]);
                column = parseInt(lineColMatch[2]);
            } else if (positionMatch) {
                const pos = parseInt(positionMatch[1]);
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

    // Feature 5: File Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                setInput(text);
                setStatus('idle');
                showToast(`Loaded ${file.name} successfully!`, 'success');
            };
            reader.readAsText(file);
        }
    };

    // Feature 6: Download Report
    const handleDownloadReport = () => {
        const report = `JSON Validation Report\nStatus: ${status.toUpperCase()}\nError details: ${errorMsg || 'None'}\nKeys: ${metrics?.keysCount || 'N/A'}\nDepth: ${metrics?.maxDepth || 'N/A'}`;
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'validation_report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Report downloaded!', 'success');
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

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'JSON Validator', href: '/json-validator' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Validator & Debugger Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Validate JSON structure against schemas, inspect keys, apply naming convention checks, and download audit reports.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Validation Toolbar Rules */}
                <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={strictMode}
                                onChange={(e) => setStrictMode(e.target.checked)}
                                className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            />
                            STRICT DUPES CHECK
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={customRuleKeys}
                                onChange={(e) => setCustomRuleKeys(e.target.checked)}
                                className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            />
                            ENFORCE camelCase KEYS
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={schemaValidation}
                                onChange={(e) => setSchemaValidation(e.target.checked)}
                                className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            />
                            SCHEMA CONSTRAINTS
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        {schemaValidation && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowSchema(!showSchema)}
                            >
                                {showSchema ? 'Hide Schema' : 'Edit Schema'}
                            </Button>
                        )}
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <FolderOpen size={16} className="mr-1.5" />
                            Upload File
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </div>
                </Card>

                {/* Optional Schema View */}
                {showSchema && schemaValidation && (
                    <Card variant="elevated" className="mb-6 p-4 bg-[var(--surface)] border border-[var(--border)]">
                        <span className="block text-xs font-bold text-[var(--text-muted)] mb-2 uppercase">Validation Schema Constraints JSON</span>
                        <textarea
                            value={schemaText}
                            onChange={(e) => setSchemaText(e.target.value)}
                            rows={4}
                            className="w-full p-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-[var(--text)] focus:outline-none"
                        />
                    </Card>
                )}

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
                                    <Button
                                        onClick={handleDownloadReport}
                                        variant="secondary"
                                        size="sm"
                                        className="mt-4 border border-green-500/30 text-green-400 hover:bg-green-500/10"
                                    >
                                        <Download size={14} className="mr-1.5" />
                                        Download Audit Report
                                    </Button>
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
                                    <Button
                                        onClick={handleDownloadReport}
                                        variant="secondary"
                                        size="sm"
                                        className="mt-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 w-full"
                                    >
                                        <Download size={14} className="mr-1.5" />
                                        Download Error Log Report
                                    </Button>
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
                                                <span className="text-xs text-[var(--text-muted)] dark:text(--text-muted)">FAILING CHARACTER</span>
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
