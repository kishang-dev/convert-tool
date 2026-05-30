import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Trash2, Check, Sparkles } from 'lucide-react';
import Head from 'next/head';

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

    // Client-side lightweight SQL pretty-printer
    const formatSql = (sql: string): string => {
        if (!sql.trim()) return '';

        // Standard SQL Keywords
        const keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
            'INNER JOIN', 'OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT',
            'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
            'DROP TABLE', 'ALTER TABLE', 'UNION', 'EXISTS', 'IN', 'LIKE', 'AS'
        ];

        // Clean extra spacing
        let clean = sql.replace(/\s+/g, ' ').trim();

        // Capitalize keywords (safe regex match with boundary checks)
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            clean = clean.replace(regex, kw);
        });

        // Insert newlines and indentation offset rules
        // Grouping formatting steps
        const newlineKeywords = [
            'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'JOIN',
            'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'UNION', 'SET', 'VALUES'
        ];

        let formatted = clean;
        
        // Break lines for major clauses
        newlineKeywords.forEach(kw => {
            const regex = new RegExp(`\\s+(${kw})\\b`, 'g');
            formatted = formatted.replace(regex, `\n$1`);
        });

        // Break lines for select columns or comma splits if needed (optional)
        formatted = formatted.replace(/\bSELECT\s+/g, 'SELECT\n  ');
        formatted = formatted.replace(/,\s+/g, ',\n  ');
        
        // Indent items following WHERE clauses slightly for clarity
        formatted = formatted.replace(/\bWHERE\s+/g, 'WHERE\n  ');
        formatted = formatted.replace(/\bAND\s+/g, '\n  AND ');
        formatted = formatted.replace(/\bOR\s+/g, '\n  OR ');

        return formatted;
    };

    const handleFormat = () => {
        if (!input.trim()) {
            showToast('Please paste a SQL query first', 'error');
            return;
        }

        try {
            const result = formatSql(input);
            setOutput(result);
            showToast('SQL Formatted successfully!', 'success');
        } catch (e: any) {
            showToast('Failed to format query', 'error');
        }
    };

    const handleMinify = () => {
        if (!input.trim()) {
            showToast('Please paste a SQL query first', 'error');
            return;
        }

        const minified = input.replace(/\s+/g, ' ').trim();
        setOutput(minified);
        showToast('SQL Minified successfully!', 'success');
    };

    const handleLoadSample = () => {
        const sample = `select id, username, email, created_at from users left join profiles on users.id = profiles.user_id where users.active = 1 and profiles.verified = true group by users.id order by users.created_at desc limit 10;`;
        setInput(sample);
        setOutput('');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <Head>
                <title>SQL Query Formatter | QuickPDF Tools</title>
                <meta name="description" content="Beautify, indent, format, and minify SQL queries client-side instantly for MySQL, PostgreSQL, Oracle, or SQL Server." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">SQL Query Formatter</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Pretty print database query clauses. Capitalize commands and minify raw strings.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={handleLoadSample}
                            variant="ghost"
                            size="sm"
                            className="text-gray-300 hover:text-white"
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
                            className="font-bold border border-white/10"
                        >
                            Minify SQL
                        </Button>
                        <Button
                            onClick={handleFormat}
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold"
                        >
                            Format SQL
                        </Button>
                    </div>
                </div>

                {/* Editor Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* Input Pane */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[480px]">
                        <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-3 block">
                            Raw SQL Query Input
                        </span>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="select * from table where column = 'value'..."
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-gray-200 focus:outline-none focus:border-indigo-500/40 resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>

                    {/* Output Pane */}
                    <Card variant="elevated" className="flex flex-col p-6 min-h-[480px]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                                Beautified SQL Output
                            </span>
                            {output && (
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded bg-indigo-500/10"
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
                            className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-emerald-400 focus:outline-none resize-none min-h-[350px] leading-relaxed"
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
