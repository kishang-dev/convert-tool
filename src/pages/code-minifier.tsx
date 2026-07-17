import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuCopy as Copy, LuTrash2 as Trash2, LuCheck as Check, LuFileCode as FileCode, LuSparkles as Sparkles, LuZap as Zap } from "react-icons/lu";
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CodeMinifier() {
    const [tab, setTab] = useState<'HTML' | 'CSS' | 'JS'>('HTML');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [metrics, setMetrics] = useState<{ original: number; compressed: number; ratio: string } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        showToast('Minified code copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setMetrics(null);
    };

    const handleMinify = async () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'code-minifier'
        });
        if (!input.trim()) {
            showToast('Please enter some code to compress', 'error');
            return;
        }

        try {
            const res = await devToolsAPI.minifyCode(input, tab.toLowerCase());
            const result = res.result;

            setOutput(result);

            const origBytes = new Blob([input]).size;
            const compBytes = new Blob([result]).size;
            const ratio = origBytes > 0 ? ((1 - (compBytes / origBytes)) * 100).toFixed(1) : '0';

            setMetrics({
                original: origBytes,
                compressed: compBytes,
                ratio
            });

            showToast(`${tab} Minified successfully!`, 'success');
        } catch (e: any) {
            showToast('Compression failed', 'error');
        }
    };

    const handleLoadSample = () => {
        let sample = '';
        if (tab === 'HTML') {
            sample = `<!DOCTYPE html>
<!-- This is a sample HTML comment -->
<html>
  <head>
    <title>   My web page   </title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>   Minifying collapses extra spacing perfectly. </p>
  </body>
</html>`;
        } else if (tab === 'CSS') {
            sample = `/* Standard sample stylesheet */
body {
  background-color: #0f172a;
  color: white;
  margin: 0px;
}
.card {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}`;
        } else if (tab === 'JS') {
            sample = `// Simple calculation helper
function computeDouble( number ) {
  /*
    Double the input and return
  */
  const val = number * 2;
  return val;
}`;
        }
        setInput(sample);
        setOutput('');
        setMetrics(null);
    };


    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "HTML, CSS & JS Code Minifier",
        "description": "Compress and minify HTML documents, CSS stylesheets, and Javascript codes client-side in real-time.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/code-minifier`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="HTML, CSS & JS Code Minifier — Free Online Tool"
                description="Compress and minify HTML documents, CSS stylesheets, and JavaScript code client-side in real-time. No upload needed, instant results."
                canonical="/code-minifier"
                keywords="code minifier, HTML minifier, CSS minifier, JS minifier, compress HTML, minify CSS online, minify JavaScript"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs 
                    items={[
                        { label: 'Code Minifier', href: '/code-minifier' }
                    ]} 
                />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Code Minifier</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Compress HTML, CSS, and JS. Strip comments, whitespace, and empty lines instantly.
                    </p>
                </div>

                {/* Tab Selector & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] p-4 rounded">
                    <div className="flex gap-2">
                        {(['HTML', 'CSS', 'JS'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setInput(''); setOutput(''); setMetrics(null); }}
                                className={`px-4 py-2 rounded text-xs font-bold transition-all ${tab === t ? 'bg-[var(--accent)] text-[var(--text)] dark:text-[var(--text)]' : 'bg-[var(--surface)] dark:bg-[var(--accent-soft)] text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)]'}`}
                            >
                                {t} Minifier
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)]"
                        >
                            <Sparkles size={16} className="mr-1.5" />
                            Load Sample
                        </Button>
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
                            size="sm"
                            className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                        >
                            Minify Code
                        </Button>
                    </div>
                </div>

                {/* Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Input */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[480px] h-full">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase mb-3 block">
                                Raw {tab} Code Input
                            </span>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste raw ${tab} code here...`}
                                className="w-full flex-grow p-4 bg-[var(--surface)] dark:bg-[var(--surface-hover)] border border-[var(--border)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-ring)] resize-none min-h-[350px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Output & Metrics */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {metrics && (
                            <Card variant="elevated" className="border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4 flex gap-4 items-center">
                                <Zap className="text-[var(--accent)] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-sm font-bold text-[var(--accent)]">Minified Successfully</h4>
                                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1">
                                        Bytes saved: <span className="font-bold text-[var(--text)] dark:text-[var(--text)] font-mono">{metrics.original - metrics.compressed} B</span> ({metrics.ratio}% compression)
                                    </p>
                                </div>
                            </Card>
                        )}

                        <Card variant="elevated" className="p-6 flex-grow flex flex-col min-h-[350px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Minified Output</span>
                                {output && (
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-[var(--accent)]/10"
                                    >
                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                )}
                            </div>
                            <textarea
                                readOnly
                                value={output}
                                placeholder="Resulting minified code will appear here..."
                                className="w-full flex-grow p-4 bg-[var(--surface)] dark:bg-[var(--surface-hover)] border border-[var(--border)] rounded font-mono text-xs text-[var(--accent)] outline-none resize-none h-[280px]"
                            />
                        </Card>
                    </div>
                </div>
            </main>

            <ToolSEOContent toolName="HTML, CSS & JS Code Minifier" toolDescription="Compress and minify HTML, CSS, and JavaScript code instantly. Strip comments, whitespace, and reduce file size for faster websites." />
            <Footer />
        </div>
    );
}
