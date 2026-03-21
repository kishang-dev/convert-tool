import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus, LayoutGrid, Trash2, Edit, Check, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useChartStore } from "@/store/useChartStore";
import Toast from "@/components/Toast";

export default function ChartDashboard() {
    const router = useRouter();
    const { charts, fetchCharts, createChart, deleteChart, updateChart, loading } = useChartStore();
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

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
                    <button
                        onClick={handleCreateNew}
                        disabled={loading && charts.length === 0}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create New Chart</span>
                    </button>
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
                        <button
                            onClick={handleCreateNew}
                            className="px-8 py-3 bg-white text-blue-900 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                        >
                            Start Designing
                        </button>
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
