import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { LuCopy as Copy, LuTrash2 as Trash2, LuCheck as Check, LuSparkles as Sparkles } from "react-icons/lu";
import { devToolsAPI } from '@/lib/api';
import SEO from '@/components/SEO';
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function SqlFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    const handleFormat = async () => {
        if (!input.trim()) {
            showToast('Please paste a SQL query first', 'error');
            return;
        }

        try {
            const res = await devToolsAPI.formatSql(input);
            setOutput(res.result);
            showToast('SQL Formatted successfully!', 'success');
        } catch (e: any) {
            showToast(e.response?.data?.error || 'Failed to format query', 'error');
        }
    };

    const handleMinify = async () => {
        gtag.event({
            action: 'use_tool',
            category: 'Tool',
            label: 'sql-formatter'
        });
        if (!input.trim()) {
            showToast('Please paste a SQL query first', 'error');
            return;
        }

        // Minify SQL is just replacing all whitespaces with a single space.
        // It's simple enough to keep on the client-side or use the backend. 
        // We will do it here.
        const minified = input.replace(/\s+/g, ' ').trim();
        setOutput(minified);
        showToast('SQL Minified successfully!', 'success');
    };

    const handleLoadSample = () => {
        const sample = `select id, username, email, created_at from users left join profiles on users.id = profiles.user_id where users.active = 1 and profiles.verified = true group by users.id order by users.created_at desc limit 10;`;
        setInput(sample);
        setOutput('');
    };

    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SQL Query Formatter Tools",
        "description": "Beautify, indent, format, and minify SQL queries client-side instantly for MySQL, PostgreSQL, Oracle, or SQL Server.",
        "applicationCategory": "BrowserApplication",
        "operatingSystem": "All",
        "url": `https://toolbasketai.com/sql-formatter`,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO 
                title="SQL Query Formatter Tools" 
                description="Beautify, indent, format, and minify SQL queries client-side instantly for MySQL, PostgreSQL, Oracle, or SQL Server." 
                canonical="/sql-formatter"
                structuredData={structuredData}
            />

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'SQL Formatter', href: '/sql-formatter' }
                    ]}
                />

                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">SQL Query Formatter</span>
                    </h1>
                    <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto">
                        Pretty print database query clauses. Capitalize commands and minify raw strings.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                            <Sparkles size={16} className="mr-1.5" />
                            Load Sample Query
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
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
                            variant="secondary"
                            size="sm"
                            className="font-bold border border-[var(--border)]"
                        >
                            Minify SQL
                        </Button>
                        <Button
                            onClick={handleFormat}
                            size="sm"
                            className="bg-[var(--accent)] hover:bg-[var(--accent)] font-bold"
                        >
                            Format SQL
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[480px] bg-[var(--surface)] border-[var(--border)]">
                        <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-3 block">
                            Raw SQL Query Input
                        </span>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="select * from table where column = 'value'..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[480px] bg-[var(--surface)] border-[var(--border)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">
                                Beautified SQL Output
                            </span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-indigo-300 font-medium px-2.5 py-1 rounded bg-[var(--accent)]/10"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Resulting formatted database queries will appear here..."
                            className="w-full flex-grow p-4 bg-[var(--bg)] border border-[var(--border-strong)] rounded font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>
                </div>
            </main>
        
            <ToolSEOContent toolName="SQL Query Formatter Tools" toolDescription="Beautify, indent, format, and minify SQL queries client-side instantly for MySQL, PostgreSQL, Oracle, or SQL Server." />
            <Footer />
        </div>
    );
}
