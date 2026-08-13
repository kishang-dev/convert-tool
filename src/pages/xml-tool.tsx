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
    LuShieldCheck as ShieldCheck,
    LuCircleAlert as AlertCircle,
    LuFileCode as FileCode,
    LuSparkles as Sparkles,
    LuDownload as Download,
    LuUpload as Upload,
    LuSearch as Search,
    LuListTree as ListTree,
    LuChartBar as BarChart3,
    LuArrowRightLeft as ArrowRightLeft,
} from 'react-icons/lu';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

interface XmlStats {
    elements: number;
    attributes: number;
    textNodes: number;
    depth: number;
    rootTag: string;
}

interface TreeNode {
    tag: string;
    attrs: string[];
    children: TreeNode[];
    text?: string;
}

function buildTree(el: Element, depth = 0): TreeNode {
    const attrs = Array.from(el.attributes).map(a => `${a.name}="${a.value}"`);
    const children: TreeNode[] = [];
    let text = '';
    for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.ELEMENT_NODE) {
            children.push(buildTree(child as Element, depth + 1));
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
            text = child.textContent.trim();
        }
    }
    return { tag: el.tagName, attrs, children, text };
}

function TreeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
    const [open, setOpen] = useState(depth < 3);
    const hasChildren = node.children.length > 0;
    return (
        <div className="ml-4 font-mono text-xs">
            <div
                className={`flex items-start gap-1 cursor-pointer select-none ${hasChildren ? 'hover:text-[var(--accent)]' : ''}`}
                onClick={() => hasChildren && setOpen(o => !o)}
            >
                <span className="text-[var(--text-muted)] w-3 shrink-0">{hasChildren ? (open ? '▾' : '▸') : '·'}</span>
                <span className="text-indigo-400">&lt;{node.tag}</span>
                {node.attrs.map((a, i) => <span key={i} className="text-yellow-400 ml-1">{a}</span>)}
                <span className="text-indigo-400">&gt;</span>
                {!hasChildren && node.text && <span className="text-green-300 mx-1">{node.text}</span>}
                {!hasChildren && <span className="text-indigo-400">&lt;/{node.tag}&gt;</span>}
            </div>
            {open && hasChildren && (
                <div>
                    {node.text && <div className="ml-4 text-green-300">{node.text}</div>}
                    {node.children.map((c, i) => <TreeView key={i} node={c} depth={depth + 1} />)}
                    <div className="ml-4 text-indigo-400 opacity-60">&lt;/{node.tag}&gt;</div>
                </div>
            )}
        </div>
    );
}

function getStats(xmlDoc: XMLDocument): XmlStats {
    let elements = 0, attributes = 0, textNodes = 0, depth = 0;
    const walk = (el: Element, d: number) => {
        elements++;
        attributes += el.attributes.length;
        depth = Math.max(depth, d);
        for (const child of Array.from(el.childNodes)) {
            if (child.nodeType === Node.ELEMENT_NODE) walk(child as Element, d + 1);
            else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) textNodes++;
        }
    };
    walk(xmlDoc.documentElement, 1);
    return { elements, attributes, textNodes, depth, rootTag: xmlDoc.documentElement.tagName };
}

// Simple XML → JSON converter (client-side)
function xmlToJson(el: Element): any {
    const obj: any = {};
    if (el.attributes.length > 0) {
        obj['@attrs'] = {};
        for (const attr of Array.from(el.attributes)) {
            obj['@attrs'][attr.name] = attr.value;
        }
    }
    const children: ChildNode[] = Array.from(el.childNodes);
    const elemChildren = children.filter(c => c.nodeType === Node.ELEMENT_NODE) as Element[];
    const textChild = children.filter(c => c.nodeType === Node.TEXT_NODE).map(c => c.textContent?.trim()).join('').trim();

    if (elemChildren.length === 0) {
        if (textChild) return Object.keys(obj).length > 0 ? { ...obj, '#text': textChild } : textChild;
        return Object.keys(obj).length > 0 ? obj : '';
    }

    const grouped: Record<string, any[]> = {};
    for (const child of elemChildren) {
        const j = xmlToJson(child);
        if (!grouped[child.tagName]) grouped[child.tagName] = [];
        grouped[child.tagName].push(j);
    }
    for (const [k, v] of Object.entries(grouped)) {
        obj[k] = v.length === 1 ? v[0] : v;
    }
    if (textChild) obj['#text'] = textChild;
    return obj;
}

type ActiveTab = 'format' | 'tree' | 'stats' | 'json' | 'search';

export default function XmlTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [errorPos, setErrorPos] = useState<{ line?: number; column?: number }>({});
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('format');
    const [treeRoot, setTreeRoot] = useState<TreeNode | null>(null);
    const [xmlStats, setXmlStats] = useState<XmlStats | null>(null);
    const [jsonOutput, setJsonOutput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [indentSize, setIndentSize] = useState(2);
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
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setStatus('idle');
        setTreeRoot(null);
        setXmlStats(null);
        setJsonOutput('');
        setSearchResults([]);
    };

    const indent = (n: number) => ' '.repeat(n);

    const formatXml = (xmlString: string, tabSize = 2): string => {
        const tab = ' '.repeat(tabSize);
        let formatted = '';
        let level = 0;
        xmlString.split(/>\s*</).forEach((node) => {
            if (node.match(/^\/\w/)) level--;
            formatted += indent(level * tabSize) + '<' + node + '>\r\n';
            if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('?')) level++;
        });
        return formatted.substring(1, formatted.length - 3);
    };

    const parseAndValidate = (xmlString: string): XMLDocument | null => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString.trim(), 'application/xml');
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                setStatus('invalid');
                const errText = parserError.textContent || 'Unknown XML Syntax Error';
                setErrorMsg(errText);
                const lineColMatch = errText.match(/line (\d+) at column (\d+)/i) || errText.match(/error on line (\d+) at column (\d+)/i);
                if (lineColMatch) {
                    setErrorPos({ line: parseInt(lineColMatch[1]), column: parseInt(lineColMatch[2]) });
                } else {
                    setErrorPos({});
                }
                showToast('Invalid XML syntax detected!', 'error');
                return null;
            }
            setStatus('valid');
            setErrorMsg('');
            setErrorPos({});
            return xmlDoc;
        } catch (e: any) {
            setStatus('invalid');
            setErrorMsg(e.message || 'Fatal parsing error');
            showToast('Fatal XML error', 'error');
            return null;
        }
    };

    const handleFormat = () => {
        if (!input.trim()) { showToast('Please enter some XML first', 'error'); return; }
        gtag.event({ action: 'use_tool', category: 'Tool', label: 'xml-tool' });
        const xmlDoc = parseAndValidate(input);
        if (!xmlDoc) return;
        try {
            const clean = input.replace(/>\s*</g, '><').trim();
            const formatted = formatXml(clean, indentSize);
            setOutput(formatted);
            setTreeRoot(buildTree(xmlDoc.documentElement));
            setXmlStats(getStats(xmlDoc));
            showToast('XML formatted!', 'success');
        } catch {
            showToast('Formatting failed.', 'error');
        }
    };

    const handleMinify = () => {
        if (!input.trim()) { showToast('Please enter some XML first', 'error'); return; }
        const xmlDoc = parseAndValidate(input);
        if (!xmlDoc) return;
        const minified = input.replace(/>\s*</g, '><').replace(/\s{2,}/g, ' ').trim();
        setOutput(minified);
        showToast('XML minified!', 'success');
    };

    const handleConvertToJson = () => {
        if (!input.trim()) { showToast('Please enter some XML first', 'error'); return; }
        const xmlDoc = parseAndValidate(input);
        if (!xmlDoc) return;
        try {
            const json = { [xmlDoc.documentElement.tagName]: xmlToJson(xmlDoc.documentElement) };
            setJsonOutput(JSON.stringify(json, null, 2));
            setActiveTab('json');
            showToast('Converted to JSON!', 'success');
        } catch {
            showToast('JSON conversion failed.', 'error');
        }
    };

    const handleBuildTree = () => {
        if (!input.trim()) { showToast('Please enter some XML first', 'error'); return; }
        const xmlDoc = parseAndValidate(input);
        if (!xmlDoc) return;
        setTreeRoot(buildTree(xmlDoc.documentElement));
        setXmlStats(getStats(xmlDoc));
        setActiveTab('tree');
        showToast('Tree built!', 'success');
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input.trim(), 'application/xml');
        if (xmlDoc.querySelector('parsererror')) { showToast('Invalid XML', 'error'); return; }
        const results: string[] = [];
        const elements = xmlDoc.getElementsByTagName(searchQuery.trim());
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const attrs = Array.from(el.attributes).map(a => `${a.name}="${a.value}"`).join(' ');
            const text = el.textContent?.trim().substring(0, 60) || '';
            results.push(`<${el.tagName}${attrs ? ' ' + attrs : ''}>${text}...`);
        }
        setSearchResults(results);
        if (results.length === 0) showToast(`No <${searchQuery}> elements found`, 'error');
        else showToast(`Found ${results.length} element(s)`, 'success');
    };

    const handleDownload = () => {
        if (!output) { showToast('No output to download', 'error'); return; }
        const blob = new Blob([output], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.xml';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded formatted.xml', 'success');
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

    const handleLoadSample = () => {
        const sample = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101" genre="fiction">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
  </book>
  <book id="bk102" genre="fantasy">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
  </book>
</catalog>`;
        setInput(sample);
        setStatus('idle');
        setOutput('');
    };

    const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { key: 'format', label: 'Format / Minify', icon: <FileCode size={14} /> },
        { key: 'tree', label: 'Tree View', icon: <ListTree size={14} /> },
        { key: 'stats', label: 'Stats', icon: <BarChart3 size={14} /> },
        { key: 'json', label: 'XML → JSON', icon: <ArrowRightLeft size={14} /> },
        { key: 'search', label: 'Search Elements', icon: <Search size={14} /> },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "XML Formatter & Validator Tools",
        "description": "Format, beautify, validate, minify, tree-view, and convert XML documents instantly client-side.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/xml-tool`,
        "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="XML Formatter & Validator — Format, Minify, Tree View, XML to JSON"
                description="Format, beautify, validate, minify, explore the element tree, convert to JSON, and search elements in XML documents. Fully client-side and instant."
                canonical="/xml-tool"
                structuredData={structuredData}
            />

            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'XML Formatter', href: '/xml-tool' }]} />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">XML Formatter & Validator</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
                        Format, minify, validate, explore tree structure, convert to JSON, and search elements — all client-side instantly.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Main Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={handleLoadSample} variant="ghost" size="sm" className="text-[var(--text-muted)] hover:text-[var(--text)]">
                            <Sparkles size={15} className="mr-1.5" /> Sample
                        </Button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all"
                        >
                            <Upload size={14} /> Upload XML
                        </button>
                        <input ref={fileInputRef} type="file" accept=".xml,.txt" className="hidden" onChange={handleFileUpload} />
                        <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-[var(--text-muted)]">Indent:</span>
                            {[2, 4].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setIndentSize(n)}
                                    className={`text-xs px-2 py-1 rounded font-mono font-bold border transition-all ${indentSize === n ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button onClick={handleClear} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 size={15} className="mr-1.5" /> Clear
                        </Button>
                        <Button onClick={() => { parseAndValidate(input); }} variant="secondary" size="sm" className="border border-[var(--border)]">
                            Validate
                        </Button>
                        <Button onClick={handleMinify} variant="secondary" size="sm" className="border border-[var(--border)]">
                            Minify
                        </Button>
                        <Button onClick={handleBuildTree} variant="secondary" size="sm" className="border border-[var(--border)] text-purple-400">
                            <ListTree size={14} className="mr-1" /> Tree
                        </Button>
                        <Button onClick={handleConvertToJson} variant="secondary" size="sm" className="border border-[var(--border)] text-emerald-400">
                            <ArrowRightLeft size={14} className="mr-1" /> To JSON
                        </Button>
                        <Button onClick={handleFormat} size="sm" className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold">
                            Format XML
                        </Button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Input */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-5 min-h-[520px]">
                            <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase mb-3 block">Raw XML Input</span>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Paste raw XML here or upload a file..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[420px] leading-relaxed"
                            />
                        </Card>

                        {/* Validation Status */}
                        {status === 'valid' && (
                            <Card variant="elevated" className="border-green-500/30 bg-green-500/5 p-3 flex gap-3 items-center">
                                <ShieldCheck className="text-green-400 shrink-0" size={20} />
                                <span className="text-sm font-semibold text-green-400">Valid XML — Root: <code className="font-mono text-[var(--accent)]">{xmlStats?.rootTag}</code></span>
                            </Card>
                        )}
                        {status === 'invalid' && (
                            <Card variant="elevated" className="border-red-500/30 bg-red-500/5 p-4 flex gap-3 items-start">
                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-red-400">XML Syntax Error</h4>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1 font-mono max-h-[80px] overflow-y-auto break-words">{errorMsg}</p>
                                    {(errorPos.line !== undefined) && (
                                        <div className="flex gap-4 mt-2">
                                            <span className="text-xs font-mono text-red-300">Line: {errorPos.line}</span>
                                            <span className="text-xs font-mono text-red-300">Col: {errorPos.column}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right: Tabs Panel */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        {/* Tab Headers */}
                        <div className="flex gap-1 flex-wrap">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setActiveTab(t.key)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs font-bold transition-all border-b-2 ${activeTab === t.key ? 'bg-[var(--surface)] border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'}`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab: Format Output */}
                        {activeTab === 'format' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[460px]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Formatted / Minified Output</span>
                                    <div className="flex gap-2">
                                        {output && (
                                            <>
                                                <button onClick={() => handleCopy()} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-[var(--accent)]/10">
                                                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
                                                </button>
                                                <button onClick={handleDownload} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-400/10">
                                                    <Download size={12} /> .xml
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <textarea
                                    readOnly
                                    value={output}
                                    placeholder="Formatted XML output will appear here after clicking Format XML..."
                                    className="w-full flex-grow p-3 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs text-[var(--accent)] outline-none resize-none min-h-[360px] leading-relaxed"
                                />
                            </Card>
                        )}

                        {/* Tab: Tree View */}
                        {activeTab === 'tree' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[460px] overflow-auto">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Element Tree Structure</span>
                                    {!treeRoot && <span className="text-xs text-[var(--text-muted)]">Click "Tree" button to build</span>}
                                </div>
                                {treeRoot ? (
                                    <div className="overflow-auto max-h-[420px] text-xs leading-6">
                                        <TreeView node={treeRoot} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center flex-grow text-[var(--text-muted)] opacity-40 gap-2">
                                        <ListTree size={36} />
                                        <p className="text-sm">Paste XML and click Tree</p>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Tab: Stats */}
                        {activeTab === 'stats' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[460px]">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase mb-4 block">Document Statistics</span>
                                {xmlStats ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Elements', value: xmlStats.elements, color: 'text-indigo-400' },
                                            { label: 'Attributes', value: xmlStats.attributes, color: 'text-yellow-400' },
                                            { label: 'Text Nodes', value: xmlStats.textNodes, color: 'text-green-400' },
                                            { label: 'Max Depth', value: xmlStats.depth, color: 'text-purple-400' },
                                            { label: 'Root Tag', value: `<${xmlStats.rootTag}>`, color: 'text-[var(--accent)]' },
                                            { label: 'Chars', value: input.length, color: 'text-orange-400' },
                                            { label: 'Lines', value: input.split('\n').length, color: 'text-cyan-400' },
                                            { label: 'Bytes', value: `${new Blob([input]).size} B`, color: 'text-rose-400' },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                                                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className={`font-mono text-lg font-bold ${stat.color}`}>{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center flex-grow text-[var(--text-muted)] opacity-40 gap-2">
                                        <BarChart3 size={36} />
                                        <p className="text-sm">Click Format or Tree to compute stats</p>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Tab: XML → JSON */}
                        {activeTab === 'json' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[460px]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">XML → JSON Output</span>
                                    {jsonOutput && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCopy(jsonOutput)} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-[var(--accent)]/10">
                                                <Copy size={12} /> Copy
                                            </button>
                                            <button onClick={() => {
                                                const blob = new Blob([jsonOutput], { type: 'application/json' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a'); a.href = url; a.download = 'converted.json'; a.click();
                                                URL.revokeObjectURL(url);
                                            }} className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-400/10">
                                                <Download size={12} /> .json
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <textarea
                                    readOnly
                                    value={jsonOutput}
                                    placeholder="Click 'To JSON' to convert your XML to a JSON object..."
                                    className="w-full flex-grow p-3 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs text-emerald-400 outline-none resize-none min-h-[360px] leading-relaxed"
                                />
                            </Card>
                        )}

                        {/* Tab: Search */}
                        {activeTab === 'search' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[460px]">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase mb-3 block">Search XML Elements by Tag Name</span>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        placeholder="Enter tag name e.g. book, item, user..."
                                        className="flex-grow px-3 py-2 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                                    />
                                    <Button onClick={handleSearch} size="sm" className="bg-[var(--accent)] font-bold shrink-0">
                                        <Search size={14} className="mr-1" /> Search
                                    </Button>
                                </div>
                                {searchResults.length > 0 ? (
                                    <div className="overflow-auto max-h-[320px] space-y-2">
                                        {searchResults.map((r, i) => (
                                            <div key={i} className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs text-indigo-300 break-all leading-relaxed">
                                                <span className="text-[var(--text-muted)] mr-2">#{i + 1}</span>{r}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center flex-grow text-[var(--text-muted)] opacity-40 gap-2">
                                        <Search size={36} />
                                        <p className="text-sm">Enter a tag name and search</p>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <ToolSEOContent toolName="XML Formatter & Validator Tools" toolDescription="Format, beautify, validate, minify, tree-view, convert to JSON, and search elements in XML documents client-side." />
            <Footer />
        </div>
    );
}
