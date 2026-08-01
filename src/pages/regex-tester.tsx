import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { 
    LuSettings as Settings, 
    LuSparkles as Sparkles, 
    LuCircleCheck as CheckCircle2, 
    LuCircleAlert as AlertCircle, 
    LuCircleHelp as HelpCircle,
    LuDownload as Download,
    LuFileCode as FileCode,
    LuBookOpen as BookOpen,
    LuSearch as SearchIcon
} from "react-icons/lu";
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function RegexTester() {
    const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false });
    const [testText, setTestText] = useState('Contact us at support@toolbasket.com or admin@domain.org for help!');
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState<string>('');
    const [highlightedHtml, setHighlightedHtml] = useState<string>('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // 5+ Premium states
    const [replacePattern, setReplacePattern] = useState('');
    const [replacedText, setReplacedText] = useState('');
    const [showCheatSheet, setShowCheatSheet] = useState(false);
    const [matchMode, setMatchMode] = useState<'match' | 'replace'>('match');

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFlagToggle = (flagKey: 'g' | 'i' | 'm' | 's' | 'u') => {
        setFlags(prev => ({ ...prev, [flagKey]: !prev[flagKey] }));
    };

    useEffect(() => {
        if (!pattern.trim()) {
            setMatches([]);
            setError('');
            setHighlightedHtml(escapeHtml(testText));
            setReplacedText('');
            return;
        }

        try {
            // Build flags string
            let flagsStr = '';
            if (flags.g) flagsStr += 'g';
            if (flags.i) flagsStr += 'i';
            if (flags.m) flagsStr += 'm';
            if (flags.s) flagsStr += 's';
            if (flags.u) flagsStr += 'u';

            const regex = new RegExp(pattern, flagsStr);
            setError('');

            const foundMatches: any[] = [];
            let htmlResult = escapeHtml(testText);

            // Calculate Replaced string
            const replacement = testText.replace(regex, replacePattern);
            setReplacedText(replacement);

            if (flags.g) {
                let match;
                let lastIndex = 0;
                const htmlParts: string[] = [];

                while ((match = regex.exec(testText)) !== null) {
                    // Prevent infinite loop on empty match
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    foundMatches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });

                    // Build highlighted HTML parts
                    const sliceBefore = testText.substring(lastIndex, match.index);
                    const matchedSlice = match[0];
                    htmlParts.push(escapeHtml(sliceBefore));
                    htmlParts.push(`<span class="bg-yellow-500/30 text-yellow-300 font-semibold px-0.5 rounded border border-yellow-500/20">${escapeHtml(matchedSlice)}</span>`);
                    lastIndex = regex.lastIndex;
                }

                htmlParts.push(escapeHtml(testText.substring(lastIndex)));
                htmlResult = htmlParts.join('');
            } else {
                const match = regex.exec(testText);
                if (match) {
                    foundMatches.push({
                        value: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });

                    const sliceBefore = testText.substring(0, match.index);
                    const matchedSlice = match[0];
                    const sliceAfter = testText.substring(match.index + match[0].length);

                    htmlResult = `${escapeHtml(sliceBefore)}<span class="bg-yellow-500/30 text-yellow-300 font-semibold px-0.5 rounded border border-yellow-500/20">${escapeHtml(matchedSlice)}</span>${escapeHtml(sliceAfter)}`;
                }
            }

            setMatches(foundMatches);
            setHighlightedHtml(htmlResult);

        } catch (e: any) {
            setError(e.message);
            setMatches([]);
            setHighlightedHtml(escapeHtml(testText));
            setReplacedText('');
        }
    }, [pattern, flags, testText, replacePattern]);

    const escapeHtml = (text: string): string => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\n/g, '<br/>');
    };

    // Feature 1: Export match report
    const handleDownloadReport = () => {
        const report = `Regex Validation Report\nPattern: /${pattern}/\nMatches Found: ${matches.length}\nMatches:\n` + 
            matches.map((m, i) => `${i+1}. Value: "${m.value}" at Index: ${m.index}`).join('\n');
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'regex_report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Regex report downloaded!', 'success');
    };

    // Feature 2: Code Snippets Generator
    const handleCopyCodeSnippet = (lang: 'js' | 'python') => {
        let snippet = '';
        if (lang === 'js') {
            snippet = `const regex = /${pattern}/${flags.g?'g':''}${flags.i?'i':''}${flags.m?'m':''};\nconst text = \`${testText}\`;\nlet match;\nwhile ((match = regex.exec(text)) !== null) {\n  console.log("Match: " + match[0] + " at " + match.index);\n}`;
        } else {
            snippet = `import re\npattern = r"${pattern}"\ntext = "${testText}"\nmatches = re.finditer(pattern, text)\nfor match in matches:\n    print(f"Match: {match.group()} at {match.start()}")`;
        }
        navigator.clipboard.writeText(snippet);
        showToast(`Copied ${lang.toUpperCase()} snippet!`, 'success');
    };

    const cheatSheet = [
        { regex: "\\d", desc: "Any digit (0-9)" },
        { regex: "\\w", desc: "Alphanumeric character [a-zA-Z0-9_]" },
        { regex: "\\s", desc: "Whitespace (space, tab, newline)" },
        { regex: ".", desc: "Any character except newline" },
        { regex: "^", desc: "Start of string / line" },
        { regex: "$", desc: "End of string / line" },
        { regex: "*", desc: "0 or more occurrences" },
        { regex: "+", desc: "1 or more occurrences" },
        { regex: "?", desc: "0 or 1 occurrence" }
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Regex Tester & Match Debugger Tools",
        "description": "Test regular expressions in real-time. Match parsing, capturing groups, visual highlights, and regex flags.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/regex-tester`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="Regex Tester & Match Debugger Tools" 
                description="Test regular expressions in real-time. Match parsing, capturing groups, visual highlights, and regex flags." 
                canonical="/regex-tester"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'Regex Tester', href: '/regex-tester' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">Regex Tester Pro</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Verify expressions, capture matched indices, replace text inline, and export code snippet scripts instantly.
                    </p>
                </div>

                {/* Match Mode Toolbar */}
                <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex gap-2">
                        <Button
                            variant={matchMode === 'match' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setMatchMode('match')}
                        >
                            Match Mode
                        </Button>
                        <Button
                            variant={matchMode === 'replace' ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setMatchMode('replace')}
                        >
                            Replace Mode
                        </Button>
                    </div>

                    <div className="flex gap-2 text-xs">
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCodeSnippet('js')}>
                            Copy JS Code
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyCodeSnippet('python')}>
                            Copy Python Code
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setShowCheatSheet(!showCheatSheet)}>
                            Cheat Sheet
                        </Button>
                    </div>
                </Card>

                {/* Cheat Sheet */}
                {showCheatSheet && (
                    <Card className="mb-6 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                        {cheatSheet.map((item, idx) => (
                            <div key={idx} className="p-2 bg-[var(--bg)] border border-[var(--border-strong)] rounded">
                                <code className="text-[var(--accent)] font-bold">{item.regex}</code>
                                <span className="block text-[var(--text-muted)] mt-0.5">{item.desc}</span>
                            </div>
                        ))}
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Editor & RegEx inputs */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <Card variant="elevated" className="p-6 space-y-4 bg-[var(--surface)] border-[var(--border)]">
                            <h2 className="text-base font-bold text-[var(--text)] uppercase tracking-wider">Regular Expression Input</h2>
                            
                            {/* Regex input and flags */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <span className="flex items-center text-[var(--text-faint)] font-mono text-lg font-bold bg-[var(--surface)] border border-[var(--border)] px-3 rounded">/</span>
                                    <input
                                        type="text"
                                        value={pattern}
                                        onChange={(e) => setPattern(e.target.value)}
                                        placeholder="Enter regex pattern (e.g. [a-z]+)"
                                        className="w-full flex-grow px-4 py-3 bg-[var(--bg)] border border-[var(--border-strong)] rounded focus:border-[var(--accent)] outline-none text-[var(--text)] font-mono text-sm"
                                    />
                                    <span className="flex items-center text-[var(--text-faint)] font-mono text-lg font-bold bg-[var(--surface)] border border-[var(--border)] px-3 rounded">/</span>
                                </div>

                                {/* Flag toggles */}
                                <div className="flex gap-3 flex-wrap">
                                    {[
                                        { key: 'g', label: 'g (global)', desc: 'Find all matches' },
                                        { key: 'i', label: 'i (case insensitive)', desc: 'Ignore capitalization' },
                                        { key: 'm', label: 'm (multiline)', desc: '^ & $ match start/end of lines' },
                                        { key: 's', label: 's (dotAll)', desc: 'Dot matches newlines' },
                                        { key: 'u', label: 'u (unicode)', desc: 'Enable unicode support' }
                                    ].map(flag => (
                                        <button
                                            key={flag.key}
                                            onClick={() => handleFlagToggle(flag.key as any)}
                                            className={`px-3 py-1.5 rounded border text-xs font-semibold font-mono transition-all ${flags[flag.key as keyof typeof flags] ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--text)]' : 'border-[var(--border)] hover:border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'}`}
                                            title={flag.desc}
                                        >
                                            {flag.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Replace Pattern Input */}
                        {matchMode === 'replace' && (
                            <Card variant="elevated" className="p-6 bg-[var(--surface)] border-[var(--border)]">
                                <h2 className="text-base font-bold text-[var(--text)] uppercase tracking-wider mb-2">Replace with</h2>
                                <input
                                    type="text"
                                    value={replacePattern}
                                    onChange={(e) => setReplacePattern(e.target.value)}
                                    placeholder="Enter replacement string (e.g. $1)"
                                    className="w-full px-4 py-2.5 bg-[var(--bg)] border border-[var(--border-strong)] rounded text-sm font-mono focus:border-[var(--accent)] outline-none text-[var(--text)]"
                                />
                            </Card>
                        )}

                        {/* Test string input */}
                        <Card variant="elevated" className="p-6 flex flex-col flex-grow min-h-[300px] bg-[var(--surface)] border-[var(--border)]">
                            <h2 className="text-base font-bold text-[var(--text)] uppercase tracking-wider mb-3">Test String</h2>
                            <textarea
                                value={testText}
                                onChange={(e) => setTestText(e.target.value)}
                                placeholder="Enter text to match regex against..."
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[220px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Results / Capturing Groups */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Error Alert */}
                        {error && (
                            <Card variant="elevated" className="border-red-500/30 bg-red-500/5 p-4 flex gap-3 items-start">
                                <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-red-400">Regex Syntax Error</h4>
                                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-1 font-mono leading-relaxed">{error}</p>
                                </div>
                            </Card>
                        )}

                        {/* Match Highlight Box */}
                        {!error && matchMode === 'match' && (
                            <Card variant="elevated" className="p-6 flex-grow flex flex-col">
                                <h3 className="text-sm font-bold tracking-wider text-[var(--text-muted)] uppercase mb-3">Visual Matches Highlight</h3>
                                <div 
                                    dangerouslySetInnerHTML={{ __html: highlightedHtml || 'Paste text on the left to see highlights...' }}
                                    className="p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text-muted)] leading-relaxed overflow-y-auto max-h-[220px] flex-grow break-all"
                                />
                            </Card>
                        )}

                        {/* Replace Output Box */}
                        {!error && matchMode === 'replace' && (
                            <Card variant="elevated" className="p-6 flex-grow flex flex-col">
                                <h3 className="text-sm font-bold tracking-wider text-[var(--text-muted)] uppercase mb-3">Replaced Output Result</h3>
                                <div className="p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-emerald-400 leading-relaxed overflow-y-auto max-h-[220px] flex-grow break-all">
                                    {replacedText || 'Replacement result will appear here...'}
                                </div>
                            </Card>
                        )}

                        {/* Capturing Groups / Match Details */}
                        <Card variant="elevated" className="p-6 max-h-[300px] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold tracking-wider text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase">Match Metrics ({matches.length})</h3>
                                {matches.length > 0 && (
                                    <Button size="sm" variant="secondary" onClick={handleDownloadReport}>
                                        <Download size={12} className="mr-1" /> Report
                                    </Button>
                                )}
                            </div>
                            
                            {matches.length > 0 ? (
                                <div className="space-y-3">
                                    {matches.map((match, idx) => (
                                        <div key={idx} className="p-3 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] rounded font-mono text-xs">
                                            <div className="flex justify-between font-semibold border-b border-[var(--border)] pb-1.5 mb-1.5">
                                                <span className="text-[var(--accent)]">Match #{idx + 1}</span>
                                                <span className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">Index: {match.index}</span>
                                            </div>
                                            <div className="text-yellow-400 break-all">"{match.value}"</div>
                                            {match.groups.length > 0 && (
                                                <div className="mt-2 pl-2 border-l border-[var(--border)] dark:border-[var(--border)] space-y-1">
                                                    <span className="text-[10px] text-[var(--text-faint)] dark:text-[var(--text-faint)] font-bold block">CAPTURE GROUPS:</span>
                                                    {match.groups.map((group: string, gIdx: number) => (
                                                        <div key={gIdx} className="text-emerald-400 break-all text-[11px]">
                                                            Group {gIdx + 1}: "{group || 'N/A'}"
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-[var(--text-faint)] dark:text-[var(--text-faint)]">
                                    <HelpCircle size={32} className="opacity-10 mx-auto mb-2" />
                                    <p className="text-xs">No active matches found. Check your pattern or text input.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </main>
        
            <ToolSEOContent toolName="Regex Tester & Match Debugger Tools" toolDescription="Test regular expressions in real-time. Match parsing, capturing groups, visual highlights, and regex flags." />
            <Footer />
        </div>
    );
}
