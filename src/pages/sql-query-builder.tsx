import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import { Copy, Trash2, Check, Plus, Database, Sparkles } from 'lucide-react';
import Head from 'next/head';

export default function SqlQueryBuilder() {
    const [action, setAction] = useState<'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'>('SELECT');
    const [tableName, setTableName] = useState('users');
    const [columns, setColumns] = useState('id, username, email');
    const [whereConditions, setWhereConditions] = useState<{ col: string; op: string; val: string }[]>([
        { col: 'active', op: '=', val: '1' }
    ]);
    const [joins, setJoins] = useState<{ type: string; table: string; on: string }[]>([]);
    const [orderBy, setOrderBy] = useState('created_at');
    const [orderDir, setOrderDir] = useState<'ASC' | 'DESC'>('DESC');
    const [limit, setLimit] = useState('10');
    
    // Insert/Update fields
    const [insertData, setInsertData] = useState<{ key: string; val: string }[]>([
        { key: 'username', val: "'john_doe'" },
        { key: 'email', val: "'john@example.com'" }
    ]);

    const [sqlOutput, setSqlOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopy = () => {
        if (!sqlOutput) return;
        navigator.clipboard.writeText(sqlOutput);
        setCopied(true);
        showToast('Query copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const addWhereCondition = () => {
        setWhereConditions(prev => [...prev, { col: '', op: '=', val: '' }]);
    };

    const removeWhereCondition = (idx: number) => {
        setWhereConditions(prev => prev.filter((_, i) => i !== idx));
    };

    const addJoin = () => {
        setJoins(prev => [...prev, { type: 'INNER JOIN', table: '', on: '' }]);
    };

    const removeJoin = (idx: number) => {
        setJoins(prev => prev.filter((_, i) => i !== idx));
    };

    const addInsertData = () => {
        setInsertData(prev => [...prev, { key: '', val: '' }]);
    };

    const removeInsertData = (idx: number) => {
        setInsertData(prev => prev.filter((_, i) => i !== idx));
    };

    // Construct SQL Query on settings change
    useEffect(() => {
        if (!tableName.trim()) {
            setSqlOutput('-- Please enter a Table Name');
            return;
        }

        let query = '';

        if (action === 'SELECT') {
            const cols = columns.trim() ? columns.trim() : '*';
            query += `SELECT ${cols}\nFROM ${tableName}`;

            if (joins.length > 0) {
                joins.forEach(jn => {
                    if (jn.table.trim() && jn.on.trim()) {
                        query += `\n${jn.type} ${jn.table.trim()} ON ${jn.on.trim()}`;
                    }
                });
            }

            const validWheres = whereConditions.filter(w => w.col.trim() && w.val.trim());
            if (validWheres.length > 0) {
                query += '\nWHERE ' + validWheres.map((w, idx) => `${idx > 0 ? '  AND ' : ''}${w.col.trim()} ${w.op} ${w.val.trim()}`).join('\n');
            }

            if (orderBy.trim()) {
                query += `\nORDER BY ${orderBy.trim()} ${orderDir}`;
            }

            if (limit.trim() && !isNaN(Number(limit))) {
                query += `\nLIMIT ${limit.trim()}`;
            }

        } else if (action === 'INSERT') {
            const validData = insertData.filter(d => d.key.trim() && d.val.trim());
            const keys = validData.map(d => d.key.trim()).join(', ');
            const values = validData.map(d => d.val.trim()).join(', ');
            query += `INSERT INTO ${tableName} (${keys})\nVALUES (${values})`;

        } else if (action === 'UPDATE') {
            const validData = insertData.filter(d => d.key.trim() && d.val.trim());
            const setStatements = validData.map(d => `${d.key.trim()} = ${d.val.trim()}`).join(',\n  ');
            query += `UPDATE ${tableName}\nSET\n  ${setStatements}`;

            const validWheres = whereConditions.filter(w => w.col.trim() && w.val.trim());
            if (validWheres.length > 0) {
                query += '\nWHERE ' + validWheres.map((w, idx) => `${idx > 0 ? '  AND ' : ''}${w.col.trim()} ${w.op} ${w.val.trim()}`).join('\n');
            }

        } else if (action === 'DELETE') {
            query += `DELETE FROM ${tableName}`;
            const validWheres = whereConditions.filter(w => w.col.trim() && w.val.trim());
            if (validWheres.length > 0) {
                query += '\nWHERE ' + validWheres.map((w, idx) => `${idx > 0 ? '  AND ' : ''}${w.col.trim()} ${w.op} ${w.val.trim()}`).join('\n');
            }
        }

        query += ';';
        setSqlOutput(query);

    }, [action, tableName, columns, whereConditions, joins, orderBy, orderDir, limit, insertData]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-gray-900 dark:text-white">
            <Head>
                <title>Visual SQL Query Builder | ToolBasket Tools</title>
                <meta name="description" content="Build SQL SELECT, INSERT, UPDATE, and DELETE queries visually. Enter tables, fields, wheres, and joins with instant code generation." />
            </Head>

            <Navbar />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-10 animate-fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
                        <span className="gradient-text">SQL Query Builder</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
                        Construct query statements visually using form panels. Support SELECT, INSERT, and joins.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Panel: visual form input */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <Card variant="elevated" className="p-6">
                            {/* Action selector */}
                            <div className="flex border-b border-white/5 pb-4 gap-2">
                                {(['SELECT', 'INSERT', 'UPDATE', 'DELETE'] as const).map(act => (
                                    <button
                                        key={act}
                                        onClick={() => setAction(act)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${action === act ? 'bg-indigo-600 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white'}`}
                                    >
                                        {act}
                                    </button>
                                ))}
                            </div>

                            {/* Core Config */}
                            <div className="mt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Table Name</label>
                                        <input
                                            type="text"
                                            value={tableName}
                                            onChange={(e) => setTableName(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                    {action === 'SELECT' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Columns</label>
                                            <input
                                                type="text"
                                                value={columns}
                                                onChange={(e) => setColumns(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500/50 font-mono text-sm"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Columns fields (INSERT / UPDATE) */}
                                {(action === 'INSERT' || action === 'UPDATE') && (
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Fields & Values</span>
                                            <button onClick={addInsertData} className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                                                <Plus size={14} /> Add Field
                                            </button>
                                        </div>
                                        {insertData.map((d, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={d.key}
                                                    onChange={(e) => {
                                                        const copy = [...insertData];
                                                        copy[i].key = e.target.value;
                                                        setInsertData(copy);
                                                    }}
                                                    placeholder="Column Name"
                                                    className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={d.val}
                                                    onChange={(e) => {
                                                        const copy = [...insertData];
                                                        copy[i].val = e.target.value;
                                                        setInsertData(copy);
                                                    }}
                                                    placeholder="Value (e.g. 'john' or 25)"
                                                    className="w-1/2 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-sm"
                                                />
                                                <button onClick={() => removeInsertData(i)} className="text-red-400 hover:text-red-300 px-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Join Section (SELECT Only) */}
                                {action === 'SELECT' && (
                                    <div className="space-y-3 pt-2 border-t border-white/5 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">JOINS</span>
                                            <button onClick={addJoin} className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                                                <Plus size={14} /> Add Join
                                            </button>
                                        </div>
                                        {joins.map((jn, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <select
                                                    value={jn.type}
                                                    onChange={(e) => {
                                                        const copy = [...joins];
                                                        copy[i].type = e.target.value;
                                                        setJoins(copy);
                                                    }}
                                                    className="bg-[#0f172a] border border-gray-200 dark:border-white/10 p-2 rounded-lg text-xs"
                                                >
                                                    <option>INNER JOIN</option>
                                                    <option>LEFT JOIN</option>
                                                    <option>RIGHT JOIN</option>
                                                    <option>FULL JOIN</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={jn.table}
                                                    onChange={(e) => {
                                                        const copy = [...joins];
                                                        copy[i].table = e.target.value;
                                                        setJoins(copy);
                                                    }}
                                                    placeholder="Join Table"
                                                    className="w-1/3 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={jn.on}
                                                    onChange={(e) => {
                                                        const copy = [...joins];
                                                        copy[i].on = e.target.value;
                                                        setJoins(copy);
                                                    }}
                                                    placeholder="ON condition (e.g. users.id = profiles.user_id)"
                                                    className="flex-grow px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                                />
                                                <button onClick={() => removeJoin(i)} className="text-red-400 hover:text-red-300 px-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* WHERE Section (SELECT / UPDATE / DELETE) */}
                                {action !== 'INSERT' && (
                                    <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">WHERE CONDITIONS</span>
                                            <button onClick={addWhereCondition} className="text-xs text-indigo-400 font-bold flex items-center gap-1">
                                                <Plus size={14} /> Add Condition
                                            </button>
                                        </div>
                                        {whereConditions.map((w, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={w.col}
                                                    onChange={(e) => {
                                                        const copy = [...whereConditions];
                                                        copy[i].col = e.target.value;
                                                        setWhereConditions(copy);
                                                    }}
                                                    placeholder="Column"
                                                    className="w-1/3 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                                />
                                                <select
                                                    value={w.op}
                                                    onChange={(e) => {
                                                        const copy = [...whereConditions];
                                                        copy[i].op = e.target.value;
                                                        setWhereConditions(copy);
                                                    }}
                                                    className="bg-[#0f172a] border border-gray-200 dark:border-white/10 p-2 rounded-lg text-xs"
                                                >
                                                    <option>=</option>
                                                    <option>!=</option>
                                                    <option>&gt;</option>
                                                    <option>&lt;</option>
                                                    <option>LIKE</option>
                                                    <option>IS NULL</option>
                                                    <option>IS NOT NULL</option>
                                                </select>
                                                <input
                                                    type="text"
                                                    value={w.val}
                                                    onChange={(e) => {
                                                        const copy = [...whereConditions];
                                                        copy[i].val = e.target.value;
                                                        setWhereConditions(copy);
                                                    }}
                                                    placeholder="Value"
                                                    className="flex-grow px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                                />
                                                <button onClick={() => removeWhereCondition(i)} className="text-red-400 hover:text-red-300 px-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Sorting & Limit (SELECT Only) */}
                                {action === 'SELECT' && (
                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 mt-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Order By</label>
                                            <input
                                                type="text"
                                                value={orderBy}
                                                onChange={(e) => setOrderBy(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Sort Dir</label>
                                            <select
                                                value={orderDir}
                                                onChange={(e) => setOrderDir(e.target.value as any)}
                                                className="w-full px-3 py-2 bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                            >
                                                <option>ASC</option>
                                                <option>DESC</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Limit</label>
                                            <input
                                                type="text"
                                                value={limit}
                                                onChange={(e) => setLimit(e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-mono"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Panel: SQL Output Preview */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <Card variant="elevated" className="p-6 flex flex-col flex-grow min-h-[400px]">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold tracking-wider text-gray-600 dark:text-gray-400 uppercase flex items-center gap-1.5">
                                    <Database size={16} className="text-indigo-400" />
                                    Generated SQL Query
                                </h3>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-0.5 rounded bg-indigo-500/10"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre className="w-full flex-grow p-4 bg-[#090d16] border border-white/5 rounded-xl font-mono text-sm text-emerald-400 leading-relaxed overflow-x-auto max-h-[480px]">
                                {sqlOutput}
                            </pre>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
