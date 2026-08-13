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
    LuRefreshCw as RefreshCw, 
    LuLayers as Layers,
    LuDownload as Download,
    LuFolderOpen as FolderOpen,
    LuArrowUpDown as ArrowUpDown,
    LuSettings2 as SettingsIcon
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

interface DiffLine {
    type: 'equal' | 'added' | 'removed';
    content: string;
    lineNumA?: number;
    lineNumB?: number;
}

export default function JsonDiffChecker() {
    const [jsonA, setJsonA] = useState('');
    const [jsonB, setJsonB] = useState('');
    const [diffResult, setDiffResult] = useState<DiffLine[] | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // 5+ Premium features states
    const fileAInputRef = useRef<HTMLInputElement>(null);
    const fileBInputRef = useRef<HTMLInputElement>(null);
    const [ignoreWhiteSpace, setIgnoreWhiteSpace] = useState(false);
    const [diffMode, setDiffMode] = useState<'line' | 'semantic'>('line');
    const [diffStats, setDiffStats] = useState<{ added: number; removed: number; changed: number } | null>(null);
    const [indentSize, setIndentSize] = useState<number>(2);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleClear = () => {
        setJsonA('');
        setJsonB('');
        setDiffResult(null);
        setErrorMsg('');
        setDiffStats(null);
    };

    // Feature 1: Swap inputs option
    const handleSwapInputs = () => {
        const temp = jsonA;
        setJsonA(jsonB);
        setJsonB(temp);
        setDiffResult(null);
        showToast('Inputs swapped!', 'success');
    };

    // Client-side visual diff algorithm
    const calculateDiff = () => {
        if (!jsonA.trim() || !jsonB.trim()) {
            showToast('Please enter both JSON payloads to compare', 'error');
            return;
        }

        try {
            // Verify and pretty-print both JSON strings first to align keys
            const parsedA = JSON.parse(jsonA);
            const parsedB = JSON.parse(jsonB);
            setErrorMsg('');

            const formattedA = JSON.stringify(parsedA, null, indentSize);
            const formattedB = JSON.stringify(parsedB, null, indentSize);

            const linesA = formattedA.split('\n');
            const linesB = formattedB.split('\n');

            const diffs: DiffLine[] = [];
            let i = 0;
            let j = 0;
            let addedCount = 0;
            let removedCount = 0;

            // Alignment index scanner (LCS concept)
            while (i < linesA.length || j < linesB.length) {
                const lineAContent = ignoreWhiteSpace ? linesA[i]?.trim() : linesA[i];
                const lineBContent = ignoreWhiteSpace ? linesB[j]?.trim() : linesB[j];

                if (i < linesA.length && j < linesB.length) {
                    if (lineAContent === lineBContent) {
                        diffs.push({
                            type: 'equal',
                            content: linesA[i],
                            lineNumA: i + 1,
                            lineNumB: j + 1
                        });
                        i++;
                        j++;
                    } else {
                        // Check ahead
                        const lookaheadB = linesB.slice(j).map(l => ignoreWhiteSpace ? l.trim() : l).indexOf(lineAContent);
                        const lookaheadA = linesA.slice(i).map(l => ignoreWhiteSpace ? l.trim() : l).indexOf(lineBContent);

                        if (lookaheadB !== -1 && (lookaheadA === -1 || lookaheadB < lookaheadA)) {
                            // Add missing lines from B
                            for (let k = 0; k < lookaheadB; k++) {
                                diffs.push({
                                    type: 'added',
                                    content: linesB[j + k],
                                    lineNumB: j + k + 1
                                });
                                addedCount++;
                            }
                            j += lookaheadB;
                        } else if (lookaheadA !== -1) {
                            // Remove extra lines from A
                            for (let k = 0; k < lookaheadA; k++) {
                                diffs.push({
                                    type: 'removed',
                                    content: linesA[i + k],
                                    lineNumA: i + k + 1
                                });
                                removedCount++;
                            }
                            i += lookaheadA;
                        } else {
                            // Modified current lines
                            diffs.push({
                                type: 'removed',
                                content: linesA[i],
                                lineNumA: i + 1
                            });
                            diffs.push({
                                type: 'added',
                                content: linesB[j],
                                lineNumB: j + 1
                            });
                            removedCount++;
                            addedCount++;
                            i++;
                            j++;
                        }
                    }
                } else if (i < linesA.length) {
                    diffs.push({
                        type: 'removed',
                        content: linesA[i],
                        lineNumA: i + 1
                    });
                    removedCount++;
                    i++;
                } else if (j < linesB.length) {
                    diffs.push({
                        type: 'added',
                        content: linesB[j],
                        lineNumB: j + 1
                    });
                    addedCount++;
                    j++;
                }
            }

            // Feature 2: Diff Stats Summary Panel
            setDiffStats({
                added: addedCount,
                removed: removedCount,
                changed: Math.min(addedCount, removedCount)
            });

            setDiffResult(diffs);
            showToast('JSON Diff completed!', 'success');

        } catch (e: any) {
            setErrorMsg(`Invalid JSON Syntax: ${e.message}`);
            setDiffResult(null);
            setDiffStats(null);
            showToast('Parsing error in JSON inputs!', 'error');
        }
    };

    // Feature 3: File uploads for A & B
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                if (target === 'A') setJsonA(text);
                else setJsonB(text);
                showToast(`Loaded File ${target} successfully!`, 'success');
            };
            reader.readAsText(file);
        }
    };

    // Feature 4: Download unified diff patch file
    const handleDownloadDiff = () => {
        if (!diffResult) return;
        const text = diffResult.map(line => {
            const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
            return `${prefix} ${line.content}`;
        }).join('\n');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'diff_report.patch';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Patch file downloaded!', 'success');
    };

    // Feature 5: Prettify input fields inline helper
    const handlePrettifyInputs = () => {
        try {
            if (jsonA.trim()) setJsonA(JSON.stringify(JSON.parse(jsonA), null, indentSize));
            if (jsonB.trim()) setJsonB(JSON.stringify(JSON.parse(jsonB), null, indentSize));
            showToast('Aligned payloads indentation!', 'success');
        } catch (e) {
            showToast('Invalid JSON syntax in one of the fields', 'error');
        }
    };

    const handleLoadSample = () => {
        const sampleA = {
            appName: "ToolBasketAI Tools",
            version: "1.2.0",
            active: true,
            features: ["pdf-unlock", "base64", "jwt-decoder"]
        };
        const sampleB = {
            appName: "ToolBasketAI Tools",
            version: "1.3.0",
            active: false,
            features: ["pdf-unlock", "base64", "jwt-decoder", "json-diff"],
            newRelease: true
        };
        setJsonA(JSON.stringify(sampleA, null, 2));
        setJsonB(JSON.stringify(sampleB, null, 2));
        setDiffResult(null);
        setDiffStats(null);
        setErrorMsg('');
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "JSON Diff Checker Tools",
        "description": "Compare two JSON objects side-by-side in real-time. Detect insertions, deletions, and updates instantly.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/json-diff`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="JSON Diff Checker Tools"
                description="Compare two JSON objects side-by-side in real-time. Detect insertions, deletions, and updates instantly."
                canonical="/json-diff"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'JSON Diff Checker', href: '/json-diff' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Diff Checker Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Compare JSON files line-by-line, ignore spacing variations, view difference statistics, and export patch files.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Settings Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={ignoreWhiteSpace}
                                onChange={(e) => setIgnoreWhiteSpace(e.target.checked)}
                                className="rounded border-[var(--border-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                            />
                            IGNORE WHITESPACES
                        </label>

                        <div className="flex items-center gap-2">
                            <span>INDENT ALIGNMENT:</span>
                            <select
                                value={indentSize}
                                onChange={(e) => setIndentSize(Number(e.target.value))}
                                className="bg-[var(--bg)] border border-[var(--border-strong)] px-2 py-1 rounded text-xs outline-none font-bold"
                            >
                                <option value={2}>2 Spaces</option>
                                <option value={4}>4 Spaces</option>
                            </select>
                        </div>

                        <Button variant="ghost" size="sm" onClick={handlePrettifyInputs}>
                            Prettify Inputs
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleSwapInputs} className="text-teal-400">
                            <ArrowUpDown size={14} className="mr-1" />
                            Swap Inputs
                        </Button>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <Sparkles size={16} className="mr-1.5" />
                            Load Sample JSONs
                        </Button>
                        <Button
                            onClick={handleClear}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={calculateDiff}
                            className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold animate-pulse-subtle"
                        >
                            Compare JSONs
                        </Button>
                    </div>
                </div>

                {errorMsg && (
                    <Card variant="elevated" className="border-red-500/30 bg-red-500/5 p-4 flex gap-3 items-center mb-6">
                        <AlertCircle className="text-red-400 shrink-0" size={20} />
                        <span className="text-sm font-semibold text-red-400">{errorMsg}</span>
                    </Card>
                )}

                {/* Diff Stats Banner */}
                {diffStats && (
                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                        <Card className="p-3 border-l-4 border-l-green-500">
                            <span className="block text-xs font-bold text-[var(--text-muted)]">LINES ADDED</span>
                            <span className="text-xl font-bold text-green-400">+{diffStats.added}</span>
                        </Card>
                        <Card className="p-3 border-l-4 border-l-red-500">
                            <span className="block text-xs font-bold text-[var(--text-muted)]">LINES REMOVED</span>
                            <span className="text-xl font-bold text-red-400">-{diffStats.removed}</span>
                        </Card>
                        <Card className="p-3 border-l-4 border-l-teal-500">
                            <span className="block text-xs font-bold text-[var(--text-muted)]">LINES CHANGED</span>
                            <span className="text-xl font-bold text-teal-400">~{diffStats.changed}</span>
                        </Card>
                    </div>
                )}

                {/* Editor Pane Grid */}
                {!diffResult ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* JSON A */}
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[400px] bg-[var(--surface)] border-[var(--border)]">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                    JSON Original (A)
                                </span>
                                <Button size="sm" variant="ghost" onClick={() => fileAInputRef.current?.click()} className="text-xs">
                                    <FolderOpen size={12} className="mr-1" /> Load File A
                                </Button>
                                <input
                                    ref={fileAInputRef}
                                    type="file"
                                    accept=".json,.txt"
                                    onChange={(e) => handleFileUpload(e, 'A')}
                                    className="hidden"
                                />
                            </div>
                            <textarea
                                value={jsonA}
                                onChange={(e) => setJsonA(e.target.value)}
                                placeholder="Paste baseline JSON here..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[300px] leading-relaxed"
                            />
                        </Card>

                        {/* JSON B */}
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[400px] bg-[var(--surface)] border-[var(--border)]">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                    JSON Modified (B)
                                </span>
                                <Button size="sm" variant="ghost" onClick={() => fileBInputRef.current?.click()} className="text-xs">
                                    <FolderOpen size={12} className="mr-1" /> Load File B
                                </Button>
                                <input
                                    ref={fileBInputRef}
                                    type="file"
                                    accept=".json,.txt"
                                    onChange={(e) => handleFileUpload(e, 'B')}
                                    className="hidden"
                                />
                            </div>
                            <textarea
                                value={jsonB}
                                onChange={(e) => setJsonB(e.target.value)}
                                placeholder="Paste modified JSON here..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[300px] leading-relaxed"
                            />
                        </Card>
                    </div>
                ) : (
                    /* Visual Difference Result */
                    <Card variant="elevated" className="p-6">
                        <div className="flex justify-between items-center mb-4 border-b border-[var(--border)] pb-2">
                            <span className="text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text-muted)] tracking-wider uppercase flex items-center gap-2">
                                <Layers size={16} className="text-[var(--accent)]" />
                                Visual Differences
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDownloadDiff}
                                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 rounded"
                                >
                                    <Download size={12} />
                                    Download Unified Patch
                                </button>
                                <button
                                    onClick={() => setDiffResult(null)}
                                    className="text-xs text-[var(--accent)] font-bold hover:underline"
                                >
                                    Edit Payloads
                                </button>
                            </div>
                        </div>
                        <div className="bg-[var(--bg)] border border-[var(--border-strong)] rounded overflow-x-auto p-4 font-mono text-xs leading-relaxed max-h-[500px]">
                            {diffResult.map((line, idx) => (
                                <div
                                    key={idx}
                                    className={`flex py-0.5 px-2 rounded ${line.type === 'added' ? 'bg-green-500/10 text-green-300' : line.type === 'removed' ? 'bg-red-500/10 text-red-300' : 'text-[var(--text-muted)] dark:text-[var(--text-muted)]'}`}
                                >
                                    <span className="w-8 shrink-0 select-none text-[10px] text-[var(--text-muted)] pr-1 text-right">{line.lineNumA || ''}</span>
                                    <span className="w-8 shrink-0 select-none text-[10px] text-[var(--text-muted)] pr-2 text-right">{line.lineNumB || ''}</span>
                                    <span className="w-4 shrink-0 select-none font-bold">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                                    <span className="break-all whitespace-pre-wrap">{line.content}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </main>

            <ToolSEOContent toolName="JSON Diff Checker Tools" toolDescription="Compare two JSON objects side-by-side in real-time. Detect insertions, deletions, and updates instantly." />
            <Footer />
        </div>
    );
}
