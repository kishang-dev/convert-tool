import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { fileAPI, FileData } from "@/lib/api";
import { LuRotateCw as RotateCw, LuTrash2 as Trash2, LuSave as Save, LuDownload as Download, LuArrowLeft as ArrowLeft, LuLoader as Loader2, LuUndo as Undo, LuRefreshCcw as RefreshCcw, LuMousePointer2 as MousePointer2, LuPlus as Plus } from "react-icons/lu";
import Toast from "@/components/Toast";
import PageContentEditor from "@/components/PageContentEditor";

interface PageState {
    originalIndex: number;
    rotation: number;
    deleted: boolean;
    imageUrl: string;
}

export default function pdfEditor() {
    const router = useRouter();
    const { id } = router.query;

    const [file, setFile] = useState<FileData | null>(null);
    const [pages, setPages] = useState<PageState[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingPage, setEditingPage] = useState<{ index: number; url: string } | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    const getAssetUrl = (url: string) => {
        if (!url) return "";
        if (/^https?:\/\//i.test(url)) return url;

        const baseUrl = (
            process.env.NEXT_PUBLIC_ASSETS_URL ||
            process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
            process.env.NEXT_PUBLIC_BASE_URL ||
            ""
        ).replace(/\/$/, "");

        return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const cacheBust = (url: string) => {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}v=${Date.now()}`;
    };

    useEffect(() => {
        if (id && typeof id === "string") {
            loadFileAndPreviews(id);
        }
    }, [id]);

    const loadFileAndPreviews = async (fileId: string) => {
        try {
            setLoading(true);
            const fileRes = await fileAPI.getFileById(fileId);
            setFile(fileRes.file);

            const previewsRes = await fileAPI.getPreviewImages(fileId);
            if (previewsRes.images) {
                setPages(
                    previewsRes.images.map((url, index) => ({
                        originalIndex: index,
                        rotation: 0,
                        deleted: false,
                        imageUrl: cacheBust(getAssetUrl(url)),
                    }))
                );
            }
        } catch (error: any) {
            setToast({
                message: error.response?.data?.error || "Failed to load PDF",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRotate = (index: number) => {
        setPages((prev) =>
            prev.map((p, i) =>
                i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p
            )
        );
    };

    const handleDelete = (index: number) => {
        setPages((prev) =>
            prev.map((p, i) => (i === index ? { ...p, deleted: true } : p))
        );
    };

    const handleRestore = (index: number) => {
        setPages((prev) =>
            prev.map((p, i) => (i === index ? { ...p, deleted: false } : p))
        );
    };

    const switchToFile = async (newFileId: string) => {
        if (!newFileId) return;
        setEditingPage(null);
        await router.replace(`/editor/${newFileId}`, undefined, { shallow: true });
        await loadFileAndPreviews(newFileId);
    };

    const handleSave = async () => {
        if (!file) return;

        setSaving(true);
        try {
            // Filter out deleted pages and create spec
            const pagesSpec = pages
                .filter((p) => !p.deleted)
                .map((p) => ({
                    index: p.originalIndex,
                    rotation: p.rotation,
                }));

            const response = await fileAPI.editPDF(file._id, pagesSpec);
            setToast({ message: "PDF saved successfully!", type: "success" });

            if (response.file?._id) {
                await switchToFile(response.file._id);
            }

            const downloadUrl = response.downloadUrl
                ? getAssetUrl(response.downloadUrl)
                : response.file
                    ? fileAPI.getDownloadUrl(response.file)
                    : "";

            if (downloadUrl) {
                window.open(downloadUrl, "_blank", "noopener,noreferrer");
            }

        } catch (error: any) {
            setToast({
                message: error.response?.data?.error || "Failed to save PDF",
                type: "error",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAddPage = async () => {
        if (!file) return;
        try {
            setLoading(true);
            const res = await fileAPI.addPage(file._id);
            if (res.success && res.file?._id) {
                setToast({ message: "Blank page added successfully!", type: "success" });
                await switchToFile(res.file._id);
            }
        } catch (error: any) {
            setToast({
                message: error.response?.data?.error || "Failed to add page",
                type: "error",
            });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!file) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
                <p className="text-xl text-[var(--text-faint)] dark:text-[var(--text-faint)]">File not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] flex flex-col">
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <header className="bg-[var(--surface)] shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/")}
                            className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} className="text-[var(--text-muted)]" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-[var(--text)]">Edit PDF</h1>
                            <p className="text-sm text-[var(--text-faint)] dark:text-[var(--text-faint)]">{file.originalName}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[var(--accent)] text-[var(--text)] dark:text-[var(--text)] px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Save size={20} />
                        )}
                        Save & Download
                    </button>
                </div>
            </header>



            {/* Editor Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pages.map((page, index) => (
                            <div
                                key={index}
                                className={`group relative bg-[var(--surface)] rounded shadow-sm border-2 transition-all overflow-hidden ${page.deleted
                                    ? "opacity-50 border-[var(--border)] grayscale"
                                    : "border-transparent hover:border-blue-400 hover:shadow-md"
                                    }`}
                            >
                                {/* Image Container with Overlay */}
                                <div className="relative p-4 bg-[var(--surface)] min-h-[200px] flex items-center justify-center border-b">
                                    {/* Page Number */}
                                    <div className="absolute top-2 left-2 bg-black/50 text-[var(--text)] dark:text-[var(--text)] px-2 py-0.5 rounded text-xs z-10">
                                        Page {page.originalIndex + 1}
                                    </div>

                                    {/* Actions Overlay */}
                                    <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 transition-opacity ${page.deleted ? "opacity-100" : "opacity-0 group-hover:opacity-100"} z-20`}>
                                        {page.deleted ? (
                                            <button
                                                onClick={() => handleRestore(index)}
                                                className="p-3 bg-[var(--surface)] text-green-600 rounded-full hover:bg-green-50 transition-colors"
                                                title="Restore Page"
                                            >
                                                <Undo size={24} />
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRotate(index)}
                                                    className="p-3 bg-[var(--surface)] text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                                                    title="Rotate 90° CW"
                                                >
                                                    <RotateCw size={24} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="p-3 bg-[var(--surface)] text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Delete Page"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <img
                                        src={page.imageUrl}
                                        alt={`Page ${page.originalIndex + 1}`}
                                        className="max-w-full h-auto shadow-md transition-transform duration-300"
                                        style={{ transform: `rotate(${page.rotation}deg)` }}
                                    />
                                </div>

                                {/* Footer Actions */}
                                {!page.deleted && (
                                    <div className="p-3 bg-[var(--bg)] flex justify-center">
                                        <button
                                            onClick={() => setEditingPage({ index: page.originalIndex, url: page.imageUrl })}
                                            className="w-full py-2 bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text-muted)] rounded hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-medium text-sm transition-all flex items-center justify-center gap-2"
                                        >
                                            <MousePointer2 size={16} />
                                            Edit Text
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Page Card */}
                        <div
                            className="flex flex-col items-center justify-center min-h-[200px] bg-[var(--bg)] border-2 border-dashed border-[var(--border-strong)] rounded hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                            onClick={handleAddPage}
                        >
                            <div className="p-4 bg-[var(--surface)] rounded-full shadow-sm group-hover:shadow text-blue-500 mb-3">
                                <Plus size={32} />
                            </div>
                            <span className="font-medium text-[var(--text-muted)] group-hover:text-blue-600">Add New Page</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Content Editor Modal */}
            {editingPage && file && (
                <PageContentEditor
                    fileId={file._id}
                    pageIndex={editingPage.index}
                    imageUrl={editingPage.url}
                    onClose={() => setEditingPage(null)}
                    onSave={async (newId) => {
                        if (newId) {
                            setToast({ message: "PDF content saved successfully!", type: "success" });
                            await switchToFile(newId);
                        }
                    }}
                />
            )}
        </div>
    );
}
