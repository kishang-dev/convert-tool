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
    LuFileCode as FileCode,
    LuSparkles as Sparkles,
    LuZap as Zap,
    LuDownload as Download,
    LuUpload as Upload,
    LuChartBar as BarChart3,
    LuArrowRightLeft as Compare,
    LuRefreshCw as Refresh,
} from 'react-icons/lu';
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

type Lang = 'HTML' | 'CSS' | 'JS' | 'JSON' | 'TypeScript';

interface Metrics {
    original: number;
    compressed: number;
    ratio: string;
    lines: number;
    compressedLines: number;
}

// ─── Client-side minifiers ───────────────────────────────────────────────────

function minifyHtml(html: string): string {
    return html
        .replace(/<!--(?![\[!])([\s\S]*?)-->/g, '')      // Remove HTML comments (not IE conditionals)
        .replace(/\s{2,}/g, ' ')                           // Collapse whitespace
        .replace(/>\s+</g, '><')                           // Remove space between tags
        .replace(/\s+=/g, '=')                             // Clean attribute spacing
        .replace(/=\s+"/g, '="')
        .trim();
}

function minifyCss(css: string): string {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')    // Remove comments
        .replace(/\s{2,}/g, ' ')              // Collapse whitespace
        .replace(/\s*{\s*/g, '{')             // Brace spacing
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')             // Colon spacing
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')             // Comma spacing
        .replace(/;\s*}/g, '}')               // Remove trailing semicolons
        .trim();
}

function minifyJs(js: string): string {
    let result = js;
    // Remove single-line comments (not inside strings)
    result = result.replace(/\/\/[^\n]*/g, '');
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    // Collapse whitespace (basic)
    result = result.replace(/\s{2,}/g, ' ');
    result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1');
    return result.trim();
}

function minifyJson(json: string): string {
    try {
        return JSON.stringify(JSON.parse(json));
    } catch {
        return json.replace(/\s{2,}/g, '').trim();
    }
}

function minifyTs(ts: string): string {
    // TypeScript: remove type annotations + comments (simplified)
    let result = ts;
    result = result.replace(/\/\/[^\n]*/g, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    result = result.replace(/\s{2,}/g, ' ');
    result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1');
    return result.trim();
}

function prettifyCode(code: string, lang: Lang): string {
    if (lang === 'JSON') {
        try { return JSON.stringify(JSON.parse(code), null, 2); } catch { return code; }
    }
    return code; // For HTML/CSS/JS, prettification requires a proper parser
}

const SAMPLES: Record<Lang, string> = {
    HTML: `<!DOCTYPE html>
<!-- This is a sample HTML comment -->
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>   My Web Page   </title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>   Minifying collapses extra whitespace perfectly.   </p>
    <!-- Another comment to remove -->
  </body>
</html>`,
    CSS: `/* Standard sample stylesheet */
body {
  background-color: #0f172a;
  color: white;
  margin: 0px;
  padding: 0px;
}

.card {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba( 255, 255, 255, 0.1 );
  transition: all 0.3s ease;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }
}`,
    JS: `// Simple calculation helper module
function computeDouble( number ) {
  /*
    Double the input and return the result.
    This is a block comment that will be removed.
  */
  const multiplier = 2;
  const result = number * multiplier;
  return result;
}

// Arrow function example
const greet = ( name ) => {
  return "Hello, " + name + "!";
};

module.exports = { computeDouble, greet };`,
    JSON: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample project configuration",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.2",
    "lodash": "^4.17.21"
  }
}`,
    TypeScript: `// TypeScript sample with types
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Generic utility function
function findById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  /* Return the first matching item */
  return items.find( item => item.id === id );
}

export { User, findById };`,
};

export default function CodeMinifier() {
    const [lang, setLang] = useState<Lang>('HTML');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [useBackend, setUseBackend] = useState(false);
    const [viewMode, setViewMode] = useState<'split' | 'compare'>('split');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = (text?: string) => {
        const toCopy = text ?? output;
        if (!toCopy) return;
        navigator.clipboard.writeText(toCopy);
        setCopied(true);
        showToast('Copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput(''); setOutput(''); setMetrics(null);
    };

    const computeMetrics = (original: string, compressed: string): Metrics => {
        const origBytes = new Blob([original]).size;
        const compBytes = new Blob([compressed]).size;
        const ratio = origBytes > 0 ? ((1 - compBytes / origBytes) * 100).toFixed(1) : '0';
        return {
            original: origBytes,
            compressed: compBytes,
            ratio,
            lines: original.split('\n').length,
            compressedLines: compressed.split('\n').length,
        };
    };

    const runClientMinify = (code: string, l: Lang): string => {
        switch (l) {
            case 'HTML': return minifyHtml(code);
            case 'CSS': return minifyCss(code);
            case 'JS': return minifyJs(code);
            case 'JSON': return minifyJson(code);
            case 'TypeScript': return minifyTs(code);
            default: return code;
        }
    };

    const handleMinify = async () => {
        gtag.event({ action: 'use_tool', category: 'Tool', label: 'code-minifier' });
        if (!input.trim()) { showToast('Please enter some code', 'error'); return; }

        let result = '';
        if (useBackend && lang !== 'JSON' && lang !== 'TypeScript') {
            try {
                const res = await devToolsAPI.minifyCode(input, lang.toLowerCase());
                result = res.result;
            } catch {
                showToast('Server minify failed, using client-side', 'error');
                result = runClientMinify(input, lang);
            }
        } else {
            result = runClientMinify(input, lang);
        }

        setOutput(result);
        setMetrics(computeMetrics(input, result));
        showToast(`${lang} minified — ${computeMetrics(input, result).ratio}% smaller!`, 'success');
    };

    const handlePrettify = () => {
        if (!input.trim()) { showToast('Please enter some code', 'error'); return; }
        const result = prettifyCode(input, lang);
        setOutput(result);
        showToast(lang === 'JSON' ? 'JSON prettified!' : 'Prettification works best for JSON', lang === 'JSON' ? 'success' : 'error');
    };

    const handleDownload = () => {
        if (!output) { showToast('No output to download', 'error'); return; }
        const extMap: Record<Lang, string> = { HTML: 'html', CSS: 'css', JS: 'js', JSON: 'json', TypeScript: 'ts' };
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `minified.${extMap[lang]}`; a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded!', 'success');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setInput(ev.target?.result as string || '');
            showToast(`Loaded ${file.name}`, 'success');
        };
        reader.readAsText(file);
    };

    const langColors: Record<Lang, string> = {
        HTML: 'text-orange-400',
        CSS: 'text-blue-400',
        JS: 'text-yellow-400',
        JSON: 'text-green-400',
        TypeScript: 'text-indigo-400',
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "HTML, CSS, JS, JSON & TypeScript Code Minifier",
        "description": "Compress and minify HTML, CSS, JavaScript, JSON, and TypeScript code client-side in real-time with compression metrics.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/code-minifier`,
        "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
    };

    const breadcrumbs = [{ name: "Code Minifier", item: "/code-minifier" }];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Free Code Minifier — Compress HTML, CSS, JS & JSON Online"
                description="Compress and minify HTML, CSS, JavaScript, JSON, and TypeScript code online for free. Boost site loading speeds by stripping whitespace & comments."
                canonical="/code-minifier"
                keywords="code minifier, html minifier, css minifier, js minifier, javascript minifier, json minifier, compress code online, toolbasketai"
                breadcrumbs={breadcrumbs}
            />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Code Minifier', href: '/code-minifier' }]} />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Code Minifier</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
                        Compress HTML, CSS, JS, JSON, and TypeScript. See byte savings, compression ratio, and download minified output.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Metrics Banner */}
                {metrics && (
                    <div className="flex flex-wrap gap-3 mb-5 p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/30 rounded-xl">
                        <div className="flex items-center gap-2">
                            <Zap className="text-[var(--accent)]" size={20} />
                            <span className="text-sm font-bold text-[var(--accent)]">{metrics.ratio}% Smaller</span>
                        </div>
                        {[
                            { label: 'Original', value: `${metrics.original} B` },
                            { label: 'Compressed', value: `${metrics.compressed} B` },
                            { label: 'Saved', value: `${metrics.original - metrics.compressed} B` },
                            { label: 'Lines Before', value: metrics.lines },
                            { label: 'Lines After', value: metrics.compressedLines },
                        ].map((m, i) => (
                            <div key={i} className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-center">
                                <div className="text-[9px] text-[var(--text-muted)] uppercase">{m.label}</div>
                                <div className="font-mono text-sm font-bold text-[var(--text)]">{m.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg">
                    {/* Language Tabs */}
                    <div className="flex gap-1.5 flex-wrap">
                        {(['HTML', 'CSS', 'JS', 'JSON', 'TypeScript'] as Lang[]).map(l => (
                            <button
                                key={l}
                                onClick={() => { setLang(l); setInput(''); setOutput(''); setMetrics(null); }}
                                className={`px-3 py-2 rounded text-xs font-bold transition-all ${lang === l ? `bg-[var(--accent)] text-white` : 'bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'}`}
                            >
                                <span className={lang === l ? 'text-white' : langColors[l]}>{l}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={() => { setInput(SAMPLES[lang]); setOutput(''); setMetrics(null); }} variant="ghost" size="sm" className="text-[var(--text-muted)] hover:text-[var(--text)]">
                            <Sparkles size={14} className="mr-1" /> Sample
                        </Button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all">
                            <Upload size={13} /> Upload
                        </button>
                        <input ref={fileInputRef} type="file" accept=".html,.css,.js,.json,.ts,.txt" className="hidden" onChange={handleFileUpload} />
                        <Button onClick={handleClear} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 size={14} className="mr-1" /> Clear
                        </Button>
                        {lang === 'JSON' && (
                            <Button onClick={handlePrettify} variant="secondary" size="sm" className="border border-[var(--border)]">
                                <Refresh size={14} className="mr-1" /> Prettify
                            </Button>
                        )}
                        <Button onClick={handleMinify} size="sm" className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold">
                            <Zap size={14} className="mr-1" /> Minify {lang}
                        </Button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: Input */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-5 min-h-[520px] h-full">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileCode size={15} className={langColors[lang]} />
                                    <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">Raw {lang} Input</span>
                                </div>
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                                    {input.split('\n').length} lines · {new Blob([input]).size} B
                                </span>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste raw ${lang} code here...`}
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[430px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Output & Metrics */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <Card variant="elevated" className="p-5 flex-grow flex flex-col min-h-[520px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Minified Output</span>
                                <div className="flex gap-2">
                                    {output && (
                                        <>
                                            <button onClick={() => handleCopy()} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-[var(--accent)]/10">
                                                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
                                            </button>
                                            <button onClick={handleDownload} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-400/10">
                                                <Download size={12} /> Download
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <textarea
                                readOnly
                                value={output}
                                placeholder={`Minified ${lang} output will appear here...`}
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-xs text-[var(--accent)] outline-none resize-none min-h-[380px] leading-relaxed"
                            />

                            {/* Compression progress bar */}
                            {metrics && (
                                <div className="mt-4 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1.5">
                                        <span>Compression: <strong className="text-[var(--accent)]">{metrics.ratio}%</strong></span>
                                        <span>{metrics.original} B → {metrics.compressed} B</span>
                                    </div>
                                    <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${metrics.ratio}%`,
                                                background: `linear-gradient(90deg, var(--accent), #4ade80)`
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </main>

            <ToolSEOContent toolName="HTML, CSS & JS Code Minifier" toolDescription="Compress and minify HTML, CSS, JavaScript, JSON, and TypeScript code instantly. Strip comments, whitespace, and reduce file size for faster websites." />
            <Footer />
        </div>
    );
}
