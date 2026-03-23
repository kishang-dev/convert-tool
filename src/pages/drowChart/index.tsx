import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus, LayoutGrid, Trash2, Edit, Check, X, Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useChartStore } from "@/store/useChartStore";
import Toast from "@/components/Toast";

export default function ChartDashboard() {
    const router = useRouter();
    const { charts, fetchCharts, createChart, deleteChart, updateChart, generateAIChart, loading } = useChartStore();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // AI Form State
    const [aiForm, setAiForm] = useState({
        title: "",
        prompt: "",
        platform: "openai",
        apiKey: ""
    });

    useEffect(() => {
        fetchCharts();
    }, [fetchCharts]);

    const handleCreateNew = async () => {
        try {
            const newChart = await createChart({ title: "Untitled Masterpiece" });
            router.push(`/drowChart/${newChart._id}`);
        } catch (err) {
            setToast({ message: "Failed to create new flowchart", type: "error" });
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
                apiKey: aiForm.apiKey
            });
            setIsAIModalOpen(false);
            setToast({ message: "Flowchart generated successfully!", type: "success" });
            router.push(`/drowChart/${newChart._id}`);
        } catch (err: any) {
            setToast({ message: err.response?.data?.error || "AI Generation failed", type: "error" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this flowchart?")) {
            try {
                await deleteChart(id);
                setToast({ message: "Chart deleted successfully", type: "success" });
            } catch (err) {
                setToast({ message: "Failed to delete flowchart", type: "error" });
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
            setToast({ message: "Chart renamed", type: "success" });
        } catch (err) {
            setToast({ message: "Failed to rename", type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            {/* AI Modal */}
            {isAIModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-500">
                    <div className="bg-[#1e293b] border border-white/10 rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden group">

                        {/* Decorative background effects */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-1000" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000" />

                        {isGenerating ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 border-4 border-white/20">
                                        <Sparkles size={64} className="text-white animate-bounce" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center animate-spin-slow">
                                        <Loader2 size={24} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-4xl font-black gradient-text mb-4 animate-pulse uppercase tracking-tighter">Designing Brilliance</h2>
                                <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed font-medium">
                                    Our AI architect is mapping out your logic flow with precision and style...
                                </p>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsAIModalOpen(false)}
                                    className="absolute top-8 right-8 text-gray-400 hover:text-white transition-all transform hover:rotate-90"
                                >
                                    <X size={28} />
                                </button>

                                <div className="flex items-center gap-4 mb-10 relative">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] shadow-xl shadow-blue-500/20">
                                        <Sparkles className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">AI Flow Architect</h2>
                                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] opacity-70 mt-1">Generate deep-detail professional logic maps</p>
                                    </div>
                                </div>

                                <form onSubmit={handleAIContextSubmit} className="space-y-8 relative">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Project Identity</label>
                                                <input
                                                    required
                                                    value={aiForm.title}
                                                    onChange={(e) => setAiForm({ ...aiForm, title: e.target.value })}
                                                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-black text-lg placeholder:text-gray-600"
                                                    placeholder="e.g. Master Auth Flow"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">AI Engine</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {["openai", "groq", "grok", "claude"].map((p) => (
                                                        <button
                                                            key={p}
                                                            type="button"
                                                            onClick={() => setAiForm({ ...aiForm, platform: p })}
                                                            className={`py-3 px-4 rounded-xl border-2 transition-all font-black text-xs uppercase tracking-widest ${aiForm.platform === p ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Logic Blueprints</label>
                                                <textarea
                                                    required
                                                    value={aiForm.prompt}
                                                    onChange={(e) => setAiForm({ ...aiForm, prompt: e.target.value })}
                                                    className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all h-[13.5rem] resize-none font-bold placeholder:text-gray-600"
                                                    placeholder="Describe the flow you want to map out..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 items-end">
                                        <div className="flex-1">
                                            <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em] ml-1 opacity-60">Authentication Key</label>
                                            <input
                                                required
                                                type="password"
                                                value={aiForm.apiKey}
                                                onChange={(e) => setAiForm({ ...aiForm, apiKey: e.target.value })}
                                                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-mono placeholder:text-gray-600"
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-10 flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98] group/btn whitespace-nowrap"
                                        >
                                            <Sparkles size={22} className="group-hover/btn:rotate-12 transition-transform" />
                                            <span>GENERATE FLOW</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 py-32">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black gradient-text tracking-tighter mb-4">
                            Your Flowcharts
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Manage your logic flows, architecture diagrams, and mind maps.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsAIModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-400 rounded-xl font-bold transition-all active:scale-95"
                        >
                            <Sparkles size={20} />
                            <span>Create with AI</span>
                        </button>
                        <button
                            onClick={handleCreateNew}
                            disabled={loading && charts.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                        >
                            <Plus size={20} />
                            <span>Manual Chart</span>
                        </button>
                    </div>
                </div>

                {loading && charts.length === 0 ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : charts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
                        <LayoutGrid className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Flowcharts Yet</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                            Create your first flowchart to start mapping out your brilliant ideas.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIsAIModalOpen(true)}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Sparkles size={18} />
                                Start with AI
                            </button>
                            <button
                                onClick={handleCreateNew}
                                className="px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                Manual Design
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {charts.map((chart) => (
                            <div
                                key={chart._id}
                                onClick={() => editingId !== chart._id && router.push(`/drowChart/${chart._id}`)}
                                className={`group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all overflow-hidden ${editingId !== chart._id ? 'hover:border-blue-500/50 cursor-pointer' : ''}`}
                            >
                                {/* Decorative background blurs */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                                        <LayoutGrid className="text-blue-400" size={24} />
                                    </div>

                                    {editingId === chart._id ? (
                                        <div className="flex items-center gap-2 mb-2" onClick={e => e.stopPropagation()}>
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(e, chart._id)}
                                                className="w-full bg-white/10 border border-blue-500/50 rounded-lg px-2 py-1 text-white text-lg font-bold outline-none"
                                                autoFocus
                                            />
                                            <button onClick={(e) => saveEdit(e, chart._id)} className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="p-1.5 bg-gray-600 hover:bg-gray-700 rounded-lg text-white">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-blue-200 transition-colors">
                                            {chart.title || "Untitled Diagram"}
                                        </h3>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-6">
                                        <span className="text-xs font-medium text-gray-400 group-hover:text-blue-400 transition-colors">
                                            {new Date(chart.updatedAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => startEditing(e, chart._id, chart.title || "Untitled Diagram")}
                                                className="p-2 bg-white/10 hover:bg-blue-500 text-white rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, chart._id)}
                                                className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
