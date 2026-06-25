import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Trash2, Check, FileCode, Sparkles, Zap } from 'lucide-react';
import { devToolsAPI } from '@/lib/api';
import Head from 'next/head';

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

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>HTML, CSS, & JS Code Minifier | QuickPDF Tools</title>
                <meta name="description" content="Compress and minify HTML documents, CSS stylesheets, and Javascript codes client-side in real-time." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Unified Code Minifier</span>
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Compress HTML, CSS, and JS. Strip comments, whitespace, and empty lines instantly.
                    </p>
                </div>

                {/* Tab Selector & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex gap-2">
                        {(['HTML', 'CSS', 'JS'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setInput(''); setOutput(''); setMetrics(null); }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
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
                            className="text-gray-300 hover:text-white"
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
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold"
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
                            <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-3 block">
                                Raw {tab} Code Input
                            </span>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste raw ${tab} code here...`}
                                className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[350px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Output & Metrics */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {metrics && (
                            <Card variant="elevated" className="border-indigo-500/30 bg-indigo-500/5 p-4 flex gap-4 items-center">
                                <Zap className="text-indigo-400 shrink-0" size={24} />
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-400">Minified Successfully</h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Bytes saved: <span className="font-bold text-white font-mono">{metrics.original - metrics.compressed} B</span> ({metrics.ratio}% compression)
                                    </p>
                                </div>
                            </Card>
                        )}

                        <Card variant="elevated" className="p-6 flex-grow flex flex-col min-h-[350px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-gray-400 uppercase">Minified Output</span>
                                {output && (
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-500/10"
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
                                className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-xs text-indigo-400 outline-none resize-none h-[280px]"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
