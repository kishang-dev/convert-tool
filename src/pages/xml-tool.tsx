import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Trash2, Check, ShieldCheck, AlertCircle, FileCode, Sparkles } from 'lucide-react';
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function XmlTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorPos, setErrorPos] = useState<{ line?: number; column?: number }>({});
    const [rootElement, setRootElement] = useState('');
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
        setStatus('idle');
    };

    // Format XML with standard node nesting indentation
    const formatXml = (xmlString: string, tab = '  ') => {
        let formatted = '';
        let indent = '';
        xmlString.split(/>\s*</).forEach((node) => {
            if (node.match(/^\/\w/)) {
                indent = indent.substring(tab.length);
            }
            formatted += indent + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) {
                indent += tab;
            }
        });
        return formatted.substring(1, formatted.length - 3);
    };

    const handleFormat = () => {
        if (!input.trim()) {
            showToast('Please enter some XML first', 'error');
            return;
        }

        // Run validation first
        const isValid = validateXml(input);
        if (!isValid) return;

        try {
            // Clean spacing and format
            const cleanXml = input.replace(/>\s*</g, '><').trim();
            const formatted = formatXml(cleanXml);
            setOutput(formatted);
            showToast('XML formatted successfully!', 'success');
        } catch (e: any) {
            showToast('Formatting failed. Please check XML syntax.', 'error');
        }
    };

    const handleMinify = () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'xml-tool'
        });
        if (!input.trim()) {
            showToast('Please enter some XML first', 'error');
            return;
        }

        const isValid = validateXml(input);
        if (!isValid) return;

        try {
            const minified = input.replace(/>\s*</g, '><').replace(/\s{2,}/g, ' ').trim();
            setOutput(minified);
            showToast('XML minified successfully!', 'success');
        } catch (e) {
            showToast('Minification failed', 'error');
        }
    };

    const handleConvertToJSON = async () => {
        if (!input.trim()) {
            showToast('Please enter some XML first', 'error');
            return;
        }

        const isValid = validateXml(input);
        if (!isValid) return;

        try {
            const res = await devToolsAPI.xmlToJson(input);
            setOutput(res.result);
            showToast('Converted to JSON successfully!', 'success');
        } catch (e: any) {
            showToast(e.response?.data?.error || 'Failed to convert to JSON', 'error');
        }
    };

    const validateXml = (xmlString: string): boolean => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString.trim(), 'application/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                setStatus('invalid');
                const errText = parserError.textContent || 'Unknown XML Syntax Error';
                setErrorMsg(errText);
                
                // Parse line and column number from error text
                const lineColMatch = errText.match(/line (\d+) at column (\d+)/i) || errText.match(/error on line (\d+) at column (\d+)/i);
                if (lineColMatch) {
                    setErrorPos({
                        line: parseInt(lineColMatch[1]),
                        column: parseInt(lineColMatch[2])
                    });
                } else {
                    setErrorPos({});
                }
                showToast('Invalid XML syntax detected!', 'error');
                return false;
            }

            setStatus('valid');
            setErrorMsg('');
            setErrorPos({});
            setRootElement(xmlDoc.documentElement.nodeName);
            showToast('XML is valid!', 'success');
            return true;
        } catch (e: any) {
            setStatus('invalid');
            setErrorMsg(e.message || 'Fatal parsing error');
            showToast('Fatal XML error', 'error');
            return false;
        }
    };

    const handleLoadSample = () => {
        const sample = `<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;
        setInput(sample);
        setStatus('idle');
        setOutput('');
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "XML Formatter & Validator Tools",
        "description": "Format, beautify, validate, and minify your XML documents instantly client-side with full error details.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/xml-tool`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="XML Formatter & Validator Tools" 
                description="Format, beautify, validate, and minify your XML documents instantly client-side with full error details." 
                canonical="/xml-tool"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-24 md:py-28">
                <Breadcrumbs
                    items={[
                        { label: 'All Tools', href: '/tools' },
                        { label: 'XML Formatter', href: '/xml-tool' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">XML Formatter & Validator</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Beautify, minify, and inspect XML tag nesting structures instantly. Catch exact syntax lines.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
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
                            onClick={() => validateXml(input)}
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-[var(--border)]"
                        >
                            Validate
                        </Button>
                        <Button
                            onClick={handleMinify}
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-[var(--border)] dark:border-[var(--border)]"
                        >
                            Minify
                        </Button>
                        <Button
                            onClick={handleConvertToJSON}
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-[var(--border)] dark:border-[var(--border)] text-emerald-400"
                        >
                            To JSON
                        </Button>
                        <Button
                            onClick={handleFormat}
                            size="sm"
                            className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                        >
                            Format XML
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Input Editor */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[480px] h-full bg-[var(--surface)] border-[var(--border)]">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-3 block">
                                Raw XML Input
                            </span>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste raw XML tags here..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[350px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Results / Output */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {status === 'idle' && (
                            <Card variant="elevated" className="p-6 flex flex-col items-center justify-center text-center h-full text-[var(--text-faint)] dark:text-[var(--text-faint)] min-h-[200px]">
                                <ShieldCheck size={40} className="opacity-10 mb-2" />
                                <p className="text-sm font-semibold">Parser is idle</p>
                                <p className="text-[11px] text-[var(--text-muted)] mt-1">Nesting validator and formatted results will display after checking.</p>
                            </Card>
                        )}

                        {status === 'valid' && (
                            <div className="space-y-4">
                                <Card variant="elevated" className="border-green-500/30 bg-green-500/5 p-4 flex gap-3 items-center">
                                    <ShieldCheck className="text-green-400 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-sm font-bold text-green-400">Valid XML Document</h4>
                                        <p className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted)]">Root Node: <span className="font-mono text-[var(--accent)] font-bold">{rootElement}</span></p>
                                    </div>
                                </Card>

                                {output && (
                                    <Card variant="elevated" className="p-4 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Beautified Output</span>
                                            <button
                                                onClick={handleCopy}
                                                className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-[var(--accent)]/10"
                                            >
                                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                                {copied ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                        <textarea
                                            readOnly
                                            value={output}
                                            className="w-full p-3 bg-[var(--surface)] dark:bg-[var(--surface-hover)] border border-[var(--border)] rounded font-mono text-xs text-[var(--accent)] outline-none resize-none h-[280px]"
                                        />
                                    </Card>
                                )}
                            </div>
                        )}

                        {status === 'invalid' && (
                            <div className="space-y-4">
                                <Card variant="elevated" className="border-red-500/30 bg-red-500/5 p-4 flex gap-3 items-start">
                                    <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={24} />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-400">XML Syntax Error</h4>
                                        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] leading-relaxed mt-1 font-mono text-[11px] max-h-[150px] overflow-y-auto break-words">{errorMsg}</p>
                                    </div>
                                </Card>

                                {(errorPos.line !== undefined || errorPos.column !== undefined) && (
                                    <Card variant="elevated" className="p-4">
                                        <span className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-wider block mb-2">Error Position</span>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded">
                                                <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted)] block">LINE</span>
                                                <span className="font-mono text-base font-bold text-red-400">{errorPos.line}</span>
                                            </div>
                                            <div className="p-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded">
                                                <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted)] block">COLUMN</span>
                                                <span className="font-mono text-base font-bold text-red-400">{errorPos.column}</span>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        
            <ToolSEOContent toolName="XML Formatter & Validator Tools" toolDescription="Format, beautify, validate, and minify your XML documents instantly client-side with full error details." />
            <Footer />
        </div>
    );
}
