import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus, LayoutGrid, Trash2, Edit, Check, X, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useChartStore } from "@/store/useChartStore";
import Toast from "@/components/Toast";
import SEO from "@/components/SEO";

export default function ChartDashboard() {
    const router = useRouter();
    const { charts, fetchCharts, createChart, deleteChart, updateChart, generateAIChart, loading } = useChartStore();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const chartTypes = [
        "Flowchart",
        "Process Flow Diagram (PFD)",
        "Workflow Diagram",
        "Swimlane Diagram",
        "BPMN Diagram",
        "Data Flow Diagram (DFD)",
        "Decision Tree",
        "Algorithm Flowchart",
        "System Flowchart",
        "Cross-functional Flowchart"
    ];

    const [aiForm, setAiForm] = useState({
        title: "",
        prompt: "",
        platform: "openai",
        apiKey: "",
        chartType: "Flowchart"
    });

    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [manualType, setManualType] = useState("Flowchart");

    useEffect(() => {
        fetchCharts();
    }, [fetchCharts]);

    const handleCreateNew = async () => {
        try {
            const newChart = await createChart({ title: `Untitled ${manualType}`, chartType: manualType });
            setIsManualModalOpen(false);
            router.push(`/drowChart/${newChart._id}`);
        } catch (err) {
            setToast({ message: "Failed to create new diagram", type: "error" });
        }
    };

    const handleAIContextSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiForm.title || !aiForm.prompt || !aiForm.apiKey) {
            setToast({ message: "Please fill all fields", type: "error" });
            return;
        }
        setIsGenerating(true);
        try {
            const newChart = await generateAIChart({
                title: aiForm.title,
                prompt: aiForm.prompt,
                platform: aiForm.platform,
                apiKey: aiForm.apiKey,
                chartType: aiForm.chartType
            });
            setIsAIModalOpen(false);
            setToast({ message: `${aiForm.chartType} generated successfully!`, type: "success" });
            router.push(`/drowChart/${newChart._id}`);
        } catch (err: any) {
            setToast({ message: err.response?.data?.error || "AI Generation failed", type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this diagram?")) {
            try {
                await deleteChart(id);
                setToast({ message: "Diagram deleted successfully", type: "success" });
            } catch (err) {
                setToast({ message: "Failed to delete diagram", type: "error" });
            }
        }
    };

    const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
        e.stopPropagation();
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = async (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
        e.stopPropagation();
        if (!editTitle.trim()) return;
        try {
            await updateChart(id, { title: editTitle });
            setEditingId(null);
            setToast({ message: "Diagram renamed", type: "success" });
        } catch (err) {
            setToast({ message: "Failed to rename", type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="AI Chart and Diagram Maker"
                description="Create flowcharts, process diagrams, DFDs, BPMN diagrams, swimlanes, and logic maps with ToolBasketAI's free AI chart maker."
                canonical="/drowChart"
                keywords="AI chart maker, diagram maker, flowchart generator, DFD maker, BPMN diagram, ToolBasketAI"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'WebApplication',
                    name: 'AI Chart and Diagram Maker',
                    url: 'https://toolbasketai.com/drowChart',
                    applicationCategory: 'DesignApplication',
                    operatingSystem: 'All',
                    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
                }}
            />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            {/* ── Manual Creation Modal ── */}
            {isManualModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded w-full max-w-sm shadow-2xl relative">
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                            <h2 className="text-lg font-bold text-[var(--text)] uppercase tracking-tight">Select Diagram Type</h2>
                            <button
                                onClick={() => setIsManualModalOpen(false)}
                                className="p-1.5 text-[var(--text)] opacity-50 hover:opacity-100 hover:bg-[var(--bg)] rounded transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-5 space-y-4">
                            <div className="relative">
                                <select
                                    value={manualType}
                                    onChange={(e) => setManualType(e.target.value)}
                                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all font-semibold text-sm appearance-none cursor-pointer"
                                >
                                    {chartTypes.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text)] opacity-40">
                                    <LayoutGrid size={16} />
                                </div>
                            </div>
                            <button
                                onClick={handleCreateNew}
                                className="w-full py-3 bg-[var(--accent)] hover:opacity-90 text-white rounded font-bold text-sm transition-all"
                            >
                                Create {manualType.split(' ')[0]}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── AI Modal ── */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">

                        {isGenerating ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                                        <Sparkles size={36} className="text-white animate-bounce" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center">
                                        <Loader2 size={16} className="text-white animate-spin" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-[var(--text)] mb-2 uppercase tracking-tighter">Designing Brilliance</h2>
                                <p className="text-[var(--text)] opacity-50 text-sm max-w-xs mx-auto">
                                    Our AI architect is mapping out your {aiForm.chartType}...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-5 border-b border-[var(--border)] shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded">
                                            <Sparkles className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-black text-[var(--text)] tracking-tight uppercase">AI Chart Architect</h2>
                                            <p className="text-[var(--text)] opacity-40 text-[10px] uppercase tracking-widest">Generate professional diagrams in seconds</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAIModalOpen(false)}
                                        className="p-1.5 text-[var(--text)] opacity-50 hover:opacity-100 hover:bg-[var(--bg)] rounded transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Modal Body */}
                                <form onSubmit={handleAIContextSubmit} className="p-5 space-y-4 flex-1">
                                    {/* Two-column on md+ */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left column */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-[var(--text)] opacity-50 mb-1.5 uppercase tracking-widest">Project Identity</label>
                                                <input
                                                    required
                                                    value={aiForm.title}
                                                    onChange={(e) => setAiForm({ ...aiForm, title: e.target.value })}
                                                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all text-sm placeholder:text-[var(--text)] placeholder:opacity-30"
                                                    placeholder="e.g. Master Auth Flow"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-[var(--text)] opacity-50 mb-1.5 uppercase tracking-widest">Diagram Type</label>
                                                <div className="relative">
                                                    <select
                                                        value={aiForm.chartType}
                                                        onChange={(e) => setAiForm({ ...aiForm, chartType: e.target.value })}
                                                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all text-sm appearance-none cursor-pointer font-semibold"
                                                    >
                                                        {chartTypes.map(t => (
                                                            <option key={t} value={t}>{t}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text)] opacity-40">
                                                        <LayoutGrid size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-[var(--text)] opacity-50 mb-1.5 uppercase tracking-widest">AI Engine</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["openai", "groq", "grok", "claude"].map((p) => (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            onClick={() => setAiForm({ ...aiForm, platform: p })}
                                                            className={`py-2 px-3 rounded border transition-all text-xs font-bold uppercase tracking-widest ${aiForm.platform === p
                                                                ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                                                                : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)] opacity-60 hover:opacity-100'
                                                            }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right column — textarea */}
                                        <div>
                                            <label className="block text-[10px] font-black text-[var(--text)] opacity-50 mb-1.5 uppercase tracking-widest">Logic Blueprints</label>
                                            <textarea
                                                required
                                                value={aiForm.prompt}
                                                onChange={(e) => setAiForm({ ...aiForm, prompt: e.target.value })}
                                                className="w-full h-full min-h-[160px] bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all text-sm resize-none placeholder:text-[var(--text)] placeholder:opacity-30"
                                                placeholder="Describe the logic you want to map out..."
                                            />
                                        </div>
                                    </div>

                                    {/* API Key + Submit */}
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end pt-1">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-black text-[var(--text)] opacity-50 mb-1.5 uppercase tracking-widest">Authentication Key</label>
                                            <input
                                                required
                                                type="password"
                                                value={aiForm.apiKey}
                                                onChange={(e) => setAiForm({ ...aiForm, apiKey: e.target.value })}
                                                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded px-4 py-2.5 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-all text-sm font-mono placeholder:opacity-30"
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded font-bold text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                        >
                                            <Sparkles size={16} />
                                            <span>Generate Diagram</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text)] tracking-tighter mb-1">
                            All Professional Charts
                        </h1>
                        <p className="text-[var(--text)] opacity-50 text-sm">
                            Manage your logic flows, architecture diagrams, DFDs, and business processes.
                        </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--accent)] text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-white rounded font-bold text-sm transition-all active:scale-95"
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline">Create with AI</span>
                            <span className="sm:hidden">AI</span>
                        </button>
                        <button
                            onClick={() => setIsManualModalOpen(true)}
                            disabled={loading && charts.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] hover:opacity-90 disabled:opacity-50 text-white rounded font-bold text-sm transition-all shadow-md active:scale-95"
                        >
                            <Plus size={16} />
                            <span className="hidden sm:inline">Manual Chart</span>
                            <span className="sm:hidden">New</span>
                        </button>
                    </div>
                </div>

                {/* Charts Grid / Empty State / Loader */}
                {loading && charts.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]"></div>
                    </div>
                ) : charts.length === 0 ? (
                    <div className="text-center py-20 bg-[var(--surface)] border border-[var(--border)] rounded">
                        <LayoutGrid className="mx-auto h-12 w-12 text-[var(--text)] opacity-20 mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text)] mb-2">No Diagrams Yet</h3>
                        <p className="text-[var(--text)] opacity-50 text-sm mb-6 max-w-xs mx-auto">
                            Create your first diagram to start mapping out your brilliant ideas.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setIsAIModalOpen(true)}
                                className="px-6 py-2.5 bg-[var(--accent)] text-white rounded font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"
                            >
                                <Sparkles size={16} />
                                Start with AI
                            </button>
                            <button
                                onClick={() => setIsManualModalOpen(true)}
                                className="px-6 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded font-bold text-sm hover:border-[var(--accent)] transition-all"
                            >
                                Manual Design
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {charts.map((chart) => (
                            <div
                                key={chart._id}
                                onClick={() => editingId !== chart._id && router.push(`/drowChart/${chart._id}`)}
                                className={`group relative bg-[var(--surface)] border border-[var(--border)] rounded p-5 transition-all overflow-hidden ${editingId !== chart._id ? 'hover:border-[var(--accent)] cursor-pointer hover:shadow-md' : ''}`}
                            >
                                <div className="flex flex-col h-full gap-3">
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded bg-[var(--bg)] flex items-center justify-center border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                                        <LayoutGrid className="text-[var(--accent)]" size={20} />
                                    </div>

                                    {/* Type label */}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] opacity-70">
                                        {chart.chartType || 'Flowchart'}
                                    </span>

                                    {/* Title or edit */}
                                    {editingId === chart._id ? (
                                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(e, chart._id)}
                                                className="flex-1 min-w-0 bg-[var(--bg)] border border-[var(--accent)] rounded px-2 py-1 text-[var(--text)] text-sm font-bold outline-none"
                                                autoFocus
                                            />
                                            <button onClick={(e) => saveEdit(e, chart._id)} className="p-1.5 bg-[var(--accent)] hover:opacity-90 rounded text-white shrink-0">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--text)] shrink-0">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <h3 className="text-base font-bold text-[var(--text)] truncate">
                                            {chart.title || "Untitled Diagram"}
                                        </h3>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
                                        <span className="text-[11px] text-[var(--text)] opacity-40">
                                            {new Date(chart.updatedAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => startEditing(e, chart._id, chart.title || "Untitled Diagram")}
                                                className="p-1.5 bg-[var(--bg)] hover:bg-[var(--accent)] hover:text-white text-[var(--text)] rounded transition-colors"
                                                title="Rename"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, chart._id)}
                                                className="p-1.5 bg-[var(--bg)] hover:bg-red-500 hover:text-white text-[var(--text)] rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
