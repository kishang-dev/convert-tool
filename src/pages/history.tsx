import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import { Clock, FileText, Download, Sparkles, Trash2 } from 'lucide-react';

interface FileRecord {
    _id: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    operation: string;
    createdAt: string;
}

export default function HistoryPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/files');
                if (res.data.success) {
                    setFiles(res.data.files);
                }
            } catch (err) {
                console.error("Failed to fetch history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, router]);

    const handleDeleteFile = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this file from history?')) return;
        try {
            const res = await api.delete(`/files/${id}`);
            if (res.data.success) {
                setFiles(files.filter(f => f._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete file:", err);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Allow guests to see history

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 -z-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="animate-fadeIn">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="text-purple-400" size={16} />
                            <span className="text-sm text-gray-300">Activity Log</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                            <Clock className="text-purple-400" size={32} />
                            <span className="gradient-text">Your History</span>
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base">View your past conversions and file edits.</p>
                    </div>

                    <Card variant="elevated" className="p-6">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : files.length === 0 ? (
                            <div className="text-center py-10">
                                <FileText className="mx-auto text-gray-600 mb-4" size={48} />
                                <p className="text-gray-400">No activity history found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="py-4 px-4 font-medium">File Name</th>
                                            <th className="py-4 px-4 font-medium">Operation</th>
                                            <th className="py-4 px-4 font-medium hidden md:table-cell">Size</th>
                                            <th className="py-4 px-4 font-medium hidden md:table-cell">Date</th>
                                            <th className="py-4 px-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {files.map((file) => (
                                            <tr key={file._id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 flex items-center gap-3">
                                                    <FileText className="text-blue-400 shrink-0" size={20} />
                                                    <span className="text-gray-200 truncate max-w-[120px] sm:max-w-[200px]" title={file.originalName}>
                                                        {file.originalName}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs uppercase font-medium">
                                                        {file.operation}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-gray-400 text-sm hidden md:table-cell">
                                                    {formatBytes(file.size)}
                                                </td>
                                                <td className="py-4 px-4 text-gray-400 text-sm hidden md:table-cell">
                                                    {new Date(file.createdAt).toLocaleString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <a
                                                            href={`${process.env.NEXT_PUBLIC_BASE_URL}/outputs/${file.filename}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                                                        >
                                                            <Download size={16} />
                                                            <span className="hidden sm:inline">Download</span>
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteFile(file._id)}
                                                            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                                                            title="Delete from history"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
