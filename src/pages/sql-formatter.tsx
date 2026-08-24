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
    LuSparkles as Sparkles,
    LuDownload as Download,
    LuUpload as Upload,
    LuDatabase as Database,
    LuChartBar as BarChart3,
    LuSearch as Search,
    LuList as List,
    LuCode as Code,
} from 'react-icons/lu';
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

type Dialect = 'generic' | 'mysql' | 'postgresql' | 'mssql' | 'oracle';
type ActiveTab = 'output' | 'stats' | 'tables' | 'keywords';

const SQL_KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
    'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
    'DROP TABLE', 'ALTER TABLE', 'ADD COLUMN', 'INDEX', 'PRIMARY KEY',
    'FOREIGN KEY', 'REFERENCES', 'NOT NULL', 'DEFAULT', 'UNIQUE',
    'DISTINCT', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
    'IS NULL', 'IS NOT NULL', 'UNION', 'UNION ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NULLIF',
    'CAST', 'CONVERT', 'SUBSTRING', 'TRIM', 'UPPER', 'LOWER',
    'NOW', 'CURRENT_TIMESTAMP', 'DATE', 'YEAR', 'MONTH', 'DAY',
];

// Minimal client-side SQL formatter
function formatSqlClient(sql: string, indent = 2): string {
    const pad = ' '.repeat(indent);
    const mainClauses = [
        'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING',
        'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
        'ON', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'INSERT INTO',
        'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    ];
    let result = sql.trim();
    for (const clause of mainClauses) {
        const re = new RegExp(`\\b${clause}\\b`, 'gi');
        result = result.replace(re, `\n${clause}`);
    }
    // Indent lines after main clause
    result = result.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        const isClause = mainClauses.some(c => trimmed.toUpperCase().startsWith(c.toUpperCase()));
        return isClause ? trimmed : pad + trimmed;
    }).filter(Boolean).join('\n');
    // Uppercase reserved words
    for (const kw of SQL_KEYWORDS) {
        const re = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        result = result.replace(re, kw);
    }
    return result.trim();
}

function extractTables(sql: string): string[] {
    const tables = new Set<string>();
    const patterns = [
        /FROM\s+([`"\[]?\w+[`"\]]?)/gi,
        /JOIN\s+([`"\[]?\w+[`"\]]?)/gi,
        /INTO\s+([`"\[]?\w+[`"\]]?)/gi,
        /UPDATE\s+([`"\[]?\w+[`"\]]?)/gi,
    ];
    for (const pat of patterns) {
        let m: RegExpExecArray | null;
        while ((m = pat.exec(sql)) !== null) {
            tables.add(m[1].replace(/[`"\[\]]/g, ''));
        }
    }
    return Array.from(tables);
}

function getSqlStats(sql: string) {
    const upper = sql.toUpperCase();
    return {
        chars: sql.length,
        lines: sql.split('\n').length,
        words: sql.trim().split(/\s+/).length,
        bytes: new Blob([sql]).size,
        selects: (upper.match(/\bSELECT\b/g) || []).length,
        joins: (upper.match(/\bJOIN\b/g) || []).length,
        subqueries: (sql.match(/\(/g) || []).length,
        conditions: (upper.match(/\bWHERE\b/g) || []).length,
    };
}

const SAMPLE_QUERIES: Record<string, string> = {
    'Basic SELECT': `select id, username, email, created_at from users left join profiles on users.id = profiles.user_id where users.active = 1 and profiles.verified = true group by users.id order by users.created_at desc limit 10;`,
    'INSERT': `insert into orders (user_id, product_id, quantity, status, created_at) values (42, 101, 3, 'pending', now());`,
    'CREATE TABLE': `create table products (id int primary key auto_increment, name varchar(255) not null, price decimal(10,2) default 0.00, category_id int, foreign key (category_id) references categories(id));`,
    'Subquery': `select * from employees where department_id in (select id from departments where budget > 100000) order by salary desc;`,
};

export default function SqlFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [dialect, setDialect] = useState<Dialect>('generic');
    const [activeTab, setActiveTab] = useState<ActiveTab>('output');
    const [tables, setTables] = useState<string[]>([]);
    const [stats, setStats] = useState<ReturnType<typeof getSqlStats> | null>(null);
    const [useBackend, setUseBackend] = useState(false);
    const [keywordSearch, setKeywordSearch] = useState('');
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
        setInput(''); setOutput(''); setTables([]); setStats(null);
    };

    const handleFormat = async () => {
        if (!input.trim()) { showToast('Please paste a SQL query first', 'error'); return; }
        gtag.event({ action: 'use_tool', category: 'Tool', label: 'sql-formatter' });
        if (useBackend) {
            try {
                const res = await devToolsAPI.formatSql(input);
                setOutput(res.result);
                showToast('SQL Formatted via server!', 'success');
            } catch {
                showToast('Server format failed, using client-side', 'error');
                setOutput(formatSqlClient(input));
            }
        } else {
            setOutput(formatSqlClient(input));
            showToast('SQL Formatted!', 'success');
        }
        setTables(extractTables(input));
        setStats(getSqlStats(input));
    };

    const handleMinify = () => {
        if (!input.trim()) { showToast('Please paste a SQL query first', 'error'); return; }
        const minified = input.replace(/\s+/g, ' ').trim();
        setOutput(minified);
        showToast('SQL Minified!', 'success');
    };

    const handleDownload = () => {
        if (!output) { showToast('No output to download', 'error'); return; }
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'formatted.sql'; a.click();
        URL.revokeObjectURL(url);
        showToast('Downloaded formatted.sql', 'success');
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

    const filteredKeywords = SQL_KEYWORDS.filter(k => k.includes(keywordSearch.toUpperCase()));

    const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { key: 'output', label: 'Formatted SQL', icon: <Code size={14} /> },
        { key: 'stats', label: 'Statistics', icon: <BarChart3 size={14} /> },
        { key: 'tables', label: 'Tables Detected', icon: <Database size={14} /> },
        { key: 'keywords', label: 'SQL Keywords', icon: <List size={14} /> },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SQL Query Formatter Tools",
        "description": "Beautify, format, and minify SQL queries. Extract tables, view statistics, browse keywords - all client-side.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/sql-formatter`,
        "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="SQL Query Formatter Online - Beautify, Minify & Extract SQL Tables"
                description="Format, beautify, and minify SQL database queries online for free. Supports MySQL, PostgreSQL, SQLite, T-SQL, and Oracle. Extract table names and analyze query statistics."
                canonicalUrl="https://toolbasketai.com/sql-formatter"
                keywords={["sql formatter", "sql beautifier", "minify sql query", "sql query cleaner", "extract sql tables"]}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'Developer Tools', item: '/#developer-tools' },
                    { name: 'SQL Query Formatter', item: '/sql-formatter' }
                ]}
                structuredData={structuredData}
            />
            <Navbar />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'SQL Formatter', href: '/sql-formatter' }]} />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">SQL Query Formatter</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-2xl mx-auto">
                        Format, minify, analyze and download SQL queries. Detect table names, view stats, browse keywords.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Dialect selector */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-[var(--text-muted)] font-bold uppercase">Dialect:</span>
                            {(['generic', 'mysql', 'postgresql', 'mssql', 'oracle'] as Dialect[]).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDialect(d)}
                                    className={`text-xs px-2.5 py-1 rounded font-bold border transition-all ${dialect === d ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                                >
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Sample query dropdown */}
                        <select
                            onChange={e => { if (e.target.value) { setInput(SAMPLE_QUERIES[e.target.value]); setOutput(''); } }}
                            defaultValue=""
                            className="text-xs px-2 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                        >
                            <option value="">Load Sample...</option>
                            {Object.keys(SAMPLE_QUERIES).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-all">
                            <Upload size={14} /> Upload .sql
                        </button>
                        <input ref={fileInputRef} type="file" accept=".sql,.txt" className="hidden" onChange={handleFileUpload} />
                        <Button onClick={handleClear} variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                            <Trash2 size={15} className="mr-1.5" /> Clear
                        </Button>
                        <Button onClick={handleMinify} variant="secondary" size="sm" className="border border-[var(--border)]">
                            Minify SQL
                        </Button>
                        <Button onClick={handleFormat} size="sm" className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold">
                            Format SQL
                        </Button>
                    </div>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Input */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <Card variant="elevated" className="flex flex-col p-5 min-h-[520px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold tracking-wider text-[var(--text-muted)] uppercase">Raw SQL Input</span>
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">{input.length} chars</span>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste your ${dialect} SQL query here...`}
                                className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[430px] leading-relaxed"
                            />
                        </Card>
                    </div>

                    {/* Right: Output Tabs */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
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

                        {/* Tab: Formatted Output */}
                        {activeTab === 'output' && (
                            <Card variant="elevated" className="flex flex-col p-5 min-h-[480px]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Beautified SQL</span>
                                    <div className="flex gap-2">
                                        {output && (
                                            <>
                                                <button onClick={() => handleCopy()} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-[var(--accent)]/10">
                                                    {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
                                                </button>
                                                <button onClick={handleDownload} className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-400/10">
                                                    <Download size={12} /> .sql
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <textarea
                                    readOnly
                                    value={output}
                                    placeholder="Formatted SQL output will appear here..."
                                    className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[380px] leading-relaxed"
                                />
                            </Card>
                        )}

                        {/* Tab: Statistics */}
                        {activeTab === 'stats' && (
                            <Card variant="elevated" className="p-5 min-h-[480px]">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase mb-4 block">Query Statistics</span>
                                {stats ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Characters', value: stats.chars, color: 'text-indigo-400' },
                                            { label: 'Lines', value: stats.lines, color: 'text-yellow-400' },
                                            { label: 'Words', value: stats.words, color: 'text-green-400' },
                                            { label: 'Bytes', value: `${stats.bytes} B`, color: 'text-purple-400' },
                                            { label: 'SELECT Clauses', value: stats.selects, color: 'text-[var(--accent)]' },
                                            { label: 'JOIN Count', value: stats.joins, color: 'text-orange-400' },
                                            { label: 'Subqueries', value: stats.subqueries, color: 'text-cyan-400' },
                                            { label: 'WHERE Clauses', value: stats.conditions, color: 'text-rose-400' },
                                        ].map((s, i) => (
                                            <div key={i} className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                                                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{s.label}</div>
                                                <div className={`font-mono text-lg font-bold ${s.color}`}>{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-60 text-[var(--text-muted)] opacity-40 gap-2">
                                        <BarChart3 size={36} />
                                        <p className="text-sm">Format or Minify to see statistics</p>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Tab: Tables Detected */}
                        {activeTab === 'tables' && (
                            <Card variant="elevated" className="p-5 min-h-[480px]">
                                <span className="text-xs font-bold text-[var(--text-muted)] uppercase mb-4 block">Tables Detected ({tables.length})</span>
                                {tables.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {tables.map((t, i) => (
                                            <div key={i} className="flex items-center gap-2 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg">
                                                <Database size={14} className="text-[var(--accent)] shrink-0" />
                                                <span className="font-mono text-sm text-[var(--text)] font-bold">{t}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-60 text-[var(--text-muted)] opacity-40 gap-2">
                                        <Database size={36} />
                                        <p className="text-sm">Format your SQL to extract table names</p>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Tab: SQL Keywords Reference */}
                        {activeTab === 'keywords' && (
                            <Card variant="elevated" className="p-5 min-h-[480px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase flex-grow">SQL Keywords Reference</span>
                                    <div className="relative">
                                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            value={keywordSearch}
                                            onChange={e => setKeywordSearch(e.target.value)}
                                            placeholder="Filter..."
                                            className="pl-6 pr-2 py-1 text-xs bg-[var(--bg)] border border-[var(--border)] rounded font-mono focus:outline-none focus:border-[var(--accent)] text-[var(--text)]"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 overflow-auto max-h-[380px]">
                                    {filteredKeywords.map((kw, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setInput(p => p + (p.endsWith(' ') || !p ? '' : ' ') + kw + ' ');
                                                showToast(`Added ${kw}`, 'success');
                                            }}
                                            className="px-2.5 py-1 bg-[var(--bg)] border border-[var(--border)] rounded font-mono text-xs text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all"
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <ToolSEOContent toolName="SQL Query Formatter Tools" toolDescription="Beautify, indent, format, and minify SQL queries client-side instantly for MySQL, PostgreSQL, Oracle, or SQL Server." />
            <Footer />
        </div>
    );
}
