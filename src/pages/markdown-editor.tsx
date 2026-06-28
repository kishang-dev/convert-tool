import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Check, FileText, Code, Eye, Sparkles, BookOpen } from 'lucide-react';
import Head from 'next/head';
import * as gtag from '@/lib/gtag';

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState(`# ToolBasket Markdown Document

Welcome! You can write standard Markdown on the left, and preview the **formatted visual output** or copy the **compiled HTML code** instantly on the right.

## Features:
- Real-time syntax updates
- Side-by-side split screen
- Clean CSS styling

### Sample Table:
| Feature | Mode | Speed |
| :--- | :--- | :--- |
| Converter | Offline | Instant |
| Security | Secure | High |

Feel free to paste your own *.md* files here!`);

    const [htmlOutput, setHtmlOutput] = useState('');
    const [previewTab, setPreviewTab] = useState<'visual' | 'html'>('visual');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = () => {
        if (!htmlOutput) return;
        navigator.clipboard.writeText(htmlOutput);
        setCopied(true);
        showToast('HTML code copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    // Safe, lightweight client-side Markdown to HTML compiler
    const parseMarkdownToHtml = (md: string): string => {
        let html = md;

        // Escape HTML entities to prevent raw element injections
        html = html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Tables parsing
        const lines = html.split('\n');
        let inTable = false;
        let tableHeaderParsed = false;
        const processedLines: string[] = [];

        lines.forEach((line) => {
            const isRow = line.trim().startsWith('|') && line.trim().endsWith('|');
            if (isRow) {
                const isSeparator = line.includes('---') || line.includes(':---');
                if (isSeparator) {
                    // Skip divider rows
                    return;
                }

                const cells = line.split('|').slice(1, -1).map(c => c.trim());
                if (!inTable) {
                    inTable = true;
                    processedLines.push('<table class="min-w-full border border-gray-200 dark:border-white/10 rounded-xl my-4 text-xs font-mono">');
                    processedLines.push('<thead>');
                    processedLines.push('<tr class="bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">');
                    cells.forEach(cell => processedLines.push(`<th class="p-2.5 text-left font-bold text-gray-700 dark:text-gray-300">${cell}</th>`));
                    processedLines.push('</tr>');
                    processedLines.push('</thead>');
                    processedLines.push('<tbody>');
                    tableHeaderParsed = true;
                } else {
                    processedLines.push('<tr class="border-b border-white/5 hover:bg-gray-100 dark:bg-white/5 transition-all">');
                    cells.forEach(cell => processedLines.push(`<td class="p-2.5 text-gray-600 dark:text-gray-400">${cell}</td>`));
                    processedLines.push('</tr>');
                }
            } else {
                if (inTable) {
                    processedLines.push('</tbody>');
                    processedLines.push('</table>');
                    inTable = false;
                    tableHeaderParsed = false;
                }
                processedLines.push(line);
            }
        });

        if (inTable) {
            processedLines.push('</tbody>');
            processedLines.push('</table>');
        }

        html = processedLines.join('\n');

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-indigo-400 mt-5 mb-2">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-indigo-400 mt-6 mb-3 border-b border-white/5 pb-1">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-indigo-400 mt-8 mb-4">$1</h1>');

        // Bold & Italic
        html = html.replace(/\*\*(.*)\*\*/gim, '<strong class="font-extrabold text-indigo-300">$1</strong>');
        html = html.replace(/\*(.*)\*/gim, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');

        // Code Blocks
        html = html.replace(/```([\s\S]*?)```/gim, '<pre class="p-3 my-4 bg-slate-950 border border-white/5 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">$1</pre>');
        html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono text-xs rounded">$1</code>');

        // Lists
        html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mb-1.5">$1</li>');
        html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="list-disc list-inside text-gray-600 dark:text-gray-400 ml-4 mb-1.5">$1</li>');

        // Paragraph breaks (wrap blocks of text lacking header/table structures inside <p>)
        const splitParas = html.split('\n\n');
        html = splitParas.map(para => {
            const p = para.trim();
            if (!p) return '';
            if (p.startsWith('<h') || p.startsWith('<table') || p.startsWith('<pre') || p.startsWith('<li')) return p;
            return `<p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">${p}</p>`;
        }).join('\n');

        return html;
    };

    useEffect(() => {
        const compiledHtml = parseMarkdownToHtml(markdown);
        setHtmlOutput(compiledHtml);
    }, [markdown]);

    const insertTemplate = (mdSnippet: string) => {
        setMarkdown(prev => prev + '\n' + mdSnippet);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <Head>
                <title>Markdown Editor & HTML Converter | ToolBasket Tools</title>
                <meta name="description" content="Write, edit, and convert Markdown to HTML cleanly client-side. Side-by-side panels, tables support, and instant copying." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Markdown Editor & Converter</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Edit rich documents using Markdown syntax. Compile to styled HTML or retrieve raw code snippets.
                    </p>
                </div>

                {/* Templates toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-2xl">
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase mr-1">Insert:</span>
                        <button onClick={() => insertTemplate('## New Heading')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5">H2 Heading</button>
                        <button onClick={() => insertTemplate('**Bold Text**')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5 font-bold">Bold</button>
                        <button onClick={() => insertTemplate('*Italic Text*')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5 italic">Italic</button>
                        <button onClick={() => insertTemplate('`inline_code`')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5 font-mono">Code</button>
                        <button onClick={() => insertTemplate('| Header A | Header B |\n| :--- | :--- |\n| Cell 1 | Cell 2 |')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5">Table</button>
                        <button onClick={() => insertTemplate('- Bullet Item 1\n- Bullet Item 2')} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 hover:bg-white/10 text-xs rounded font-semibold border border-white/5">List</button>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => setMarkdown('')} 
                            variant="ghost" 
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Main Split Screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Left: Input Editor */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[500px]">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={16} className="text-indigo-400" />
                            <span className="text-sm font-semibold tracking-wider text-gray-600 dark:text-gray-400 uppercase">
                                Markdown Document Input
                            </span>
                        </div>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Write your markdown files here..."
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[380px] leading-relaxed"
                        />
                    </Card>

                    {/* Right: Preview Panels */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[500px]">
                        {/* Tab Headers */}
                        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPreviewTab('visual')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${previewTab === 'visual' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
                                >
                                    <Eye size={14} />
                                    Visual Preview
                                </button>
                                <button
                                    onClick={() => setPreviewTab('html')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${previewTab === 'html' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
                                >
                                    <Code size={14} />
                                    HTML Code Output
                                </button>
                            </div>
                            
                            {previewTab === 'html' && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-500/10"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy HTML'}
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        {previewTab === 'visual' ? (
                            <div 
                                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                                className="flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl overflow-y-auto max-h-[400px] text-gray-700 dark:text-gray-300 leading-relaxed font-sans"
                            />
                        ) : (
                            <textarea
                                readOnly
                                value={htmlOutput}
                                className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-xs text-indigo-400 outline-none resize-none max-h-[400px] leading-relaxed"
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
