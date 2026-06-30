import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { ShieldCheck, AlertCircle, Sparkles, RefreshCw, Layers } from 'lucide-react';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

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

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleClear = () => {
        setJsonA('');
        setJsonB('');
        setDiffResult(null);
        setErrorMsg('');
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

            const formattedA = JSON.stringify(parsedA, null, 2);
            const formattedB = JSON.stringify(parsedB, null, 2);

            const linesA = formattedA.split('\n');
            const linesB = formattedB.split('\n');

            const diffs: DiffLine[] = [];
            let i = 0;
            let j = 0;

            // Basic alignment index scanner (Longest Common Subsequence concept)
            while (i < linesA.length || j < linesB.length) {
                if (i < linesA.length && j < linesB.length) {
                    if (linesA[i] === linesB[j]) {
                        diffs.push({
                            type: 'equal',
                            content: linesA[i],
                            lineNumA: i + 1,
                            lineNumB: j + 1
                        });
                        i++;
                        j++;
                    } else {
                        // Check if linesA[i] exists further in linesB (meaning lines were added)
                        const lookaheadB = linesB.slice(j).indexOf(linesA[i]);
                        const lookaheadA = linesA.slice(i).indexOf(linesB[j]);

                        if (lookaheadB !== -1 && (lookaheadA === -1 || lookaheadB < lookaheadA)) {
                            // Add missing lines from B
                            for (let k = 0; k < lookaheadB; k++) {
                                diffs.push({
                                    type: 'added',
                                    content: linesB[j + k],
                                    lineNumB: j + k + 1
                                });
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
                            }
                            i += lookaheadA;
                        } else {
                            // Mismatch on current lines
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
                            i++;
                            j++;
                        }
                    }
                } else if (i < linesA.length) {
                    // Leftover lines in A (removed from B)
                    diffs.push({
                        type: 'removed',
                        content: linesA[i],
                        lineNumA: i + 1
                    });
                    i++;
                } else if (j < linesB.length) {
                    // Leftover lines in B (added to B)
                    diffs.push({
                        type: 'added',
                        content: linesB[j],
                        lineNumB: j + 1
                    });
                    j++;
                }
            }

            setDiffResult(diffs);
            showToast('JSON Diff completed!', 'success');

        } catch (e: any) {
            setErrorMsg(`Invalid JSON Syntax: ${e.message}`);
            setDiffResult(null);
            showToast('Parsing error in JSON inputs!', 'error');
        }
    };

    const handleLoadSample = () => {
        const sampleA = {
            appName: "ToolBasket Tools",
            version: "1.2.0",
            active: true,
            features: ["pdf-unlock", "base64", "jwt-decoder"]
        };
        const sampleB = {
            appName: "ToolBasket Tools",
            version: "1.3.0",
            active: false,
            features: ["pdf-unlock", "base64", "jwt-decoder", "json-diff"],
            newRelease: true
        };
        setJsonA(JSON.stringify(sampleA, null, 2));
        setJsonB(JSON.stringify(sampleB, null, 2));
        setDiffResult(null);
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
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <SEO 
                title="JSON Diff Checker Tools" 
                description="Compare two JSON objects side-by-side in real-time. Detect insertions, deletions, and updates instantly." 
                canonical="/json-diff"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">JSON Diff Checker</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Compare two JSON files line-by-line. Identify additions, modifications, and deletions instantly.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:text-white"
                        >
                            <Sparkles size={16} className="mr-1.5" />
                            Load Sample JSONs
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
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
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold"
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

                {/* Editor Pane Grid */}
                {!diffResult ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* JSON A */}
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[400px]">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase mb-3 block">
                                JSON Original (A)
                            </span>
                            <textarea
                                value={jsonA}
                                onChange={(e) => setJsonA(e.target.value)}
                                placeholder="Paste baseline JSON here..."
                                className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[300px] leading-relaxed"
                            />
                        </Card>

                        {/* JSON B */}
                        <Card variant="elevated" className="flex flex-col p-6 min-h-[400px]">
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase mb-3 block">
                                JSON Modified (B)
                            </span>
                            <textarea
                                value={jsonB}
                                onChange={(e) => setJsonB(e.target.value)}
                                placeholder="Paste modified JSON here..."
                                className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[300px] leading-relaxed"
                            />
                        </Card>
                    </div>
                ) : (
                    /* Visual Difference Result */
                    <Card variant="elevated" className="p-6">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wider uppercase flex items-center gap-2">
                                <Layers size={16} className="text-indigo-400" />
                                Visual Differences
                            </span>
                            <button
                                onClick={() => setDiffResult(null)}
                                className="text-xs text-indigo-400 font-bold hover:underline"
                            >
                                Edit Payloads
                            </button>
                        </div>
                        <div className="bg-[#090d16] border border-white/5 rounded-xl overflow-x-auto p-4 font-mono text-xs leading-relaxed max-h-[500px]">
                            {diffResult.map((line, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex py-0.5 px-2 rounded ${line.type === 'added' ? 'bg-green-500/10 text-green-300' : line.type === 'removed' ? 'bg-red-500/10 text-red-300' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    {/* Line indexes */}
                                    <span className="w-8 shrink-0 select-none text-[10px] text-gray-600 pr-1 text-right">{line.lineNumA || ''}</span>
                                    <span className="w-8 shrink-0 select-none text-[10px] text-gray-600 pr-2 text-right">{line.lineNumB || ''}</span>
                                    {/* Diff indicator prefix */}
                                    <span className="w-4 shrink-0 select-none font-bold">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                                    <span className="break-all whitespace-pre-wrap">{line.content}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        
            <ToolSEOContent toolName="JSON Diff Checker Tools" toolDescription="Compare two JSON objects side-by-side in real-time. Detect insertions, deletions, and updates instantly." />
        </div>
    );
}
