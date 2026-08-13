import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import {
    LuCopy as Copy,
    LuCheck as Check,
    LuCode as Code,
    LuEye as Eye,
    LuSparkles as Sparkles,
    LuBookOpen as BookOpen,
    LuDownload as Download,
    LuUpload as Upload,
    LuChartBar as BarChart3,
    LuTrash2 as Trash2,
    LuSearch as Search,
} from 'react-icons/lu';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

const DEFAULT_CONTENT = `# ToolBasketAI Markdown Document

Welcome! Write **standard Markdown** on the left, and see the **live preview** instantly on the right.

## Features

- Real-time rendering with live preview
- One-click HTML export and copy
- Word count and reading time
- File upload & download support
- Insert snippets from toolbar

### Code Example

\`\`\`javascript
const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("World"));
\`\`\`

### Sample Table

| Feature | Status | Speed |
| :--- | :--- | :--- |
| Live Preview | ✅ Active | Instant |
| HTML Export | ✅ Ready | Instant |
| File Upload | ✅ Ready | Fast |

> **Tip:** Use the **Insert** toolbar above to quickly insert Markdown elements.

---

Feel free to paste your own *.md* files here!`;

// Safe lightweight Markdown to HTML compiler
function parseMarkdownToHtml(md: string): string {
    let html = md;

    // Escape HTML entities
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Fenced code blocks (handle first before inline)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) =>
        `<pre class="p-4 my-4 bg-slate-950 border border-slate-700/50 rounded-lg font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    );

    // Tables
    const lines = html.split('\n');
    let inTable = false;
    const processedLines: string[] = [];
    lines.forEach((line) => {
        const isRow = line.trim().startsWith('|') && line.trim().endsWith('|');
        if (isRow) {
            const isSeparator = line.includes('---') || line.includes(':---');
            if (isSeparator) return;
            const cells = line.split('|').slice(1, -1).map(c => c.trim());
            if (!inTable) {
                inTable = true;
                processedLines.push('<div class="overflow-x-auto my-4"><table class="min-w-full border border-[var(--border)] rounded-lg text-xs font-mono">');
                processedLines.push('<thead><tr class="bg-[var(--surface)] border-b border-[var(--border)]">');
                cells.forEach(cell => processedLines.push(`<th class="p-2.5 text-left font-bold text-[var(--accent)]">${cell}</th>`));
                processedLines.push('</tr></thead><tbody>');
            } else {
                processedLines.push('<tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-all">');
                cells.forEach(cell => processedLines.push(`<td class="p-2.5 text-[var(--text-muted)]">${cell}</td>`));
                processedLines.push('</tr>');
            }
        } else {
            if (inTable) { processedLines.push('</tbody></table></div>'); inTable = false; }
            processedLines.push(line);
        }
    });
    if (inTable) processedLines.push('</tbody></table></div>');
    html = processedLines.join('\n');

    // Headings
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-bold text-[var(--text)] mt-4 mb-1">$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[var(--accent)] mt-5 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-[var(--accent)] mt-6 mb-3 border-b border-[var(--border)] pb-1">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-[var(--accent)] mt-8 mb-4">$1</h1>');

    // Blockquotes
    html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="pl-4 border-l-4 border-[var(--accent)] my-3 text-[var(--text-muted)] italic text-sm">$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr class="border-[var(--border)] my-6" />');

    // Bold, italic, strikethrough
    html = html.replace(/\*\*\*([^*]+)\*\*\*/gim, '<strong class="font-extrabold"><em>$1</em></strong>');
    html = html.replace(/\*\*([^*]+)\*\*/gim, '<strong class="font-extrabold text-indigo-300">$1</strong>');
    html = html.replace(/\*([^*]+)\*/gim, '<em class="italic text-[var(--text-muted)]">$1</em>');
    html = html.replace(/~~([^~]+)~~/gim, '<del class="text-[var(--text-muted)] line-through">$1</del>');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 bg-[var(--accent)]/10 text-indigo-300 border border-[var(--accent)]/20 font-mono text-xs rounded">$1</code>');

    // Links & images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[var(--accent)] underline hover:text-indigo-300" target="_blank" rel="noopener">$1</a>');

    // Lists
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="list-disc list-inside text-[var(--text-muted)] ml-4 mb-1.5">$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="list-decimal list-inside text-[var(--text-muted)] ml-4 mb-1.5">$1</li>');

    // Paragraphs
    const paragraphs = html.split('\n\n');
    html = paragraphs.map(para => {
        const p = para.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<table') || p.startsWith('<div') || p.startsWith('<pre') || p.startsWith('<li') || p.startsWith('<hr') || p.startsWith('<blockquote')) return p;
        return `<p class="text-sm text-[var(--text-muted)] leading-relaxed mb-4">${p}</p>`;
    }).join('\n');

    return html;
}

function getStats(md: string) {
    const words = md.trim().split(/\s+/).filter(Boolean).length;
    const chars = md.length;
    const lines = md.split('\n').length;
    const readingTime = Math.max(1, Math.round(words / 200));
    const headings = (md.match(/^#{1,6} /gm) || []).length;
    const links = (md.match(/\[.*?\]\(.*?\)/g) || []).length;
    const codeBlocks = (md.match(/```/g) || []).length / 2;
    return { words, chars, lines, readingTime, headings, links, codeBlocks: Math.round(codeBlocks) };
}

const SNIPPETS: { label: string; md: string }[] = [
    { label: 'H1', md: '# Heading 1' },
    { label: 'H2', md: '## Heading 2' },
    { label: 'H3', md: '### Heading 3' },
    { label: '**Bold**', md: '**Bold Text**' },
    { label: '*Italic*', md: '*Italic Text*' },
    { label: '~~Strike~~', md: '~~Strikethrough~~' },
    { label: '`Code`', md: '`inline_code`' },
    { label: 'Code Block', md: '```javascript\nconst x = 1;\n```' },
    { label: 'Table', md: '| Header A | Header B |\n| :--- | :--- |\n| Cell 1 | Cell 2 |' },
    { label: 'List', md: '- Item 1\n- Item 2\n- Item 3' },
    { label: 'Ordered', md: '1. First\n2. Second\n3. Third' },
    { label: 'Blockquote', md: '> Important note or quote here.' },
    { label: 'Link', md: '[Link Text](https://example.com)' },
    { label: 'Divider', md: '\n---\n' },
    { label: 'Checkbox', md: '- [ ] Task 1\n- [x] Done task' },
];

const SAMPLE_TEMPLATES: Record<string, string> = {
    'README Template': `# Project Name\n\n[![License](https://img.shields.io/badge/license-MIT-blue)](#)\n\n## Description\nA short description of what this project does.\n\n## Installation\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\`\`\`bash\nnpm start\n\`\`\`\n\n## Contributing\nPull requests are welcome!\n\n## License\nMIT`,
    'API Docs': `# API Documentation\n\n## Endpoints\n\n### GET /users\nReturns a list of users.\n\n| Parameter | Type | Required |\n| :--- | :--- | :--- |\n| page | integer | No |\n| limit | integer | No |\n\n**Response:**\n\`\`\`json\n{\n  "data": [],\n  "total": 0\n}\n\`\`\``,
    'Meeting Notes': `# Meeting Notes — ${new Date().toLocaleDateString()}\n\n## Attendees\n- Alice\n- Bob\n- Charlie\n\n## Agenda\n1. Project status update\n2. Upcoming deadlines\n3. Action items\n\n## Action Items\n- [ ] Alice: Review PR by Friday\n- [ ] Bob: Deploy to staging\n`,
};

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState(DEFAULT_CONTENT);
    const [htmlOutput, setHtmlOutput] = useState('');
    const [previewTab, setPreviewTab] = useState<'visual' | 'html'>('visual');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showStats, setShowStats] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = (text?: string) => {
        const toCopy = text ?? htmlOutput;
        if (!toCopy) return;
        navigator.clipboard.writeText(toCopy);
        setCopied(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        gtag.event({ action: 'use_tool', category: 'Tool', label: 'markdown-editor' });
    }, []);

    useEffect(() => {
        setHtmlOutput(parseMarkdownToHtml(markdown));
    }, [markdown]);

    const insertAtCursor = (snippet: string) => {
        const ta = textareaRef.current;
        if (!ta) { setMarkdown(p => p + '\n' + snippet); return; }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newVal = markdown.substring(0, start) + '\n' + snippet + '\n' + markdown.substring(end);
        setMarkdown(newVal);
        setTimeout(() => {
            ta.selectionStart = ta.selectionEnd = start + snippet.length + 2;
            ta.focus();
        }, 0);
    };

    const handleDownloadMd = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'document.md'; a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded document.md', 'success');
    };

    const handleDownloadHtml = () => {
        const fullHtml = `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8"><title>Markdown Export</title></head>\n<body>\n${htmlOutput}\n</body>\n</html>`;
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'document.html'; a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded document.html', 'success');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setMarkdown(ev.target?.result as string || '');
            showToast(`Loaded ${file.name}`, 'success');
        };
        reader.readAsText(file);
    };

    const stats = getStats(markdown);

    const searchHighlight = searchQuery.trim()
        ? htmlOutput.replace(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark style="background:rgba(129,140,248,0.35);color:inherit;border-radius:2px;">$1</mark>')
        : htmlOutput;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Markdown Editor & HTML Converter",
        "description": "Write, edit, and convert Markdown to HTML client-side. Live preview, word count, file upload/download, snippet toolbar.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/markdown-editor`,
        "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Markdown Editor & HTML Converter — Live Preview, Word Count, Export"
                description="Write and edit Markdown with live preview. Convert to HTML, download .md or .html files, see word count and reading time — fully client-side."
                canonical="/markdown-editor"
                structuredData={structuredData}
            />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Markdown Editor', href: '/markdown-editor' }]} />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Markdown Editor</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
                        Write Markdown with live HTML preview. Export to .md or .html, see word counts, and insert snippets.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Stats Bar */}
                {showStats && (
                    <div className="flex flex-wrap gap-3 mb-4 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                        {[
                            { label: 'Words', value: stats.words, color: 'text-indigo-400' },
                            { label: 'Chars', value: stats.chars, color: 'text-yellow-400' },
                            { label: 'Lines', value: stats.lines, color: 'text-green-400' },
                            { label: 'Reading Time', value: `~${stats.readingTime} min`, color: 'text-purple-400' },
                            { label: 'Headings', value: stats.headings, color: 'text-[var(--accent)]' },
                            { label: 'Links', value: stats.links, color: 'text-orange-400' },
                            { label: 'Code Blocks', value: stats.codeBlocks, color: 'text-cyan-400' },
                        ].map((s, i) => (
                            <div key={i} className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-center min-w-[80px]">
                                <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
                                <div className={`font-mono text-sm font-bold ${s.color}`}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Snippet Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg">
                    <div className="flex gap-1.5 flex-wrap items-center">
                        <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase mr-1 shrink-0">Insert:</span>
                        {SNIPPETS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => insertAtCursor(s.md)}
                                className="px-2 py-1 bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-[10px] rounded font-mono font-bold border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center flex-wrap shrink-0">
                        {/* Template dropdown */}
                        <select
                            onChange={e => { if (e.target.value) { setMarkdown(SAMPLE_TEMPLATES[e.target.value]); showToast('Template loaded!'); } }}
                            defaultValue=""
                            className="text-xs px-2 py-1.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                        >
                            <option value="">Templates...</option>
                            {Object.keys(SAMPLE_TEMPLATES).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <button onClick={() => setShowStats(s => !s)} className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border transition-all ${showStats ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}>
                            <BarChart3 size={13} /> Stats
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all">
                            <Upload size={13} /> Upload .md
                        </button>
                        <input ref={fileInputRef} type="file" accept=".md,.txt,.markdown" className="hidden" onChange={handleFileUpload} />
                        <button onClick={handleDownloadMd} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border border-[var(--border)] text-emerald-400 hover:bg-emerald-400/10 transition-all">
                            <Download size={13} /> .md
                        </button>
                        <button onClick={handleDownloadHtml} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded border border-[var(--border)] text-indigo-400 hover:bg-indigo-400/10 transition-all">
                            <Download size={13} /> .html
                        </button>
                        <Button onClick={() => setMarkdown('')} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 size={13} className="mr-1" /> Clear
                        </Button>
                    </div>
                </div>

                {/* Main Split Screen */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Left: Input Editor */}
                    <Card variant="elevated" className="flex flex-col p-5 min-h-[580px]">
                        <div className="flex items-center gap-2 mb-3 justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen size={15} className="text-[var(--accent)]" />
                                <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">Markdown Input</span>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--text-muted)]">{stats.words} words · {stats.chars} chars</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            placeholder="Write your Markdown here..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[500px] leading-relaxed"
                        />
                    </Card>

                    {/* Right: Preview Panel */}
                    <Card variant="elevated" className="flex flex-col p-5 min-h-[580px]">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                            <div className="flex gap-1.5">
                                {[
                                    { key: 'visual' as const, icon: <Eye size={13} />, label: 'Visual Preview' },
                                    { key: 'html' as const, icon: <Code size={13} />, label: 'HTML Output' },
                                ].map(t => (
                                    <button
                                        key={t.key}
                                        onClick={() => setPreviewTab(t.key)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${previewTab === t.key ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                                    >
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center">
                                {previewTab === 'visual' && (
                                    <div className="relative">
                                        <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Find in preview..."
                                            className="pl-5 pr-2 py-1 text-xs bg-[var(--bg)] border border-[var(--border)] rounded focus:outline-none focus:border-[var(--accent)] text-[var(--text)] w-32"
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleCopy(previewTab === 'html' ? htmlOutput : markdown)}
                                    className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-[var(--accent)]/10"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : previewTab === 'html' ? 'Copy HTML' : 'Copy MD'}
                                </button>
                            </div>
                        </div>

                        {previewTab === 'visual' ? (
                            <div
                                dangerouslySetInnerHTML={{ __html: searchHighlight }}
                                className="flex-grow p-4 bg-[var(--bg)] border border-[var(--border)] rounded overflow-y-auto max-h-[520px] text-[var(--text-muted)] leading-relaxed font-sans text-sm"
                            />
                        ) : (
                            <textarea
                                readOnly
                                value={htmlOutput}
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs text-[var(--accent)] outline-none resize-none max-h-[520px] leading-relaxed"
                            />
                        )}
                    </Card>
                </div>
            </main>

            <ToolSEOContent toolName="Markdown Editor & HTML Converter Tools" toolDescription="Write, edit, and convert Markdown to HTML cleanly client-side. Side-by-side panels, tables support, word counts, templates, and instant file download." />
            <Footer />
        </div>
    );
}
