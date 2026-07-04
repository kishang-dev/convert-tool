import React, { useState } from "react";
import { ArrowDown, ArrowUp, FileText, GripVertical, Loader2, X } from "lucide-react";

export interface PdfPreviewPage {
    id: string;
    fileId: string;
    fileName: string;
    pageIndex: number;
    imageUrl: string;
}

interface PdfPageOrganizerProps {
    pages: PdfPreviewPage[];
    loading?: boolean;
    onChange: (pages: PdfPreviewPage[]) => void;
    onRemovePage?: (pageId: string) => void;
}

export default function PdfPageOrganizer({
    pages,
    loading = false,
    onChange,
    onRemovePage,
}: PdfPageOrganizerProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);

    const movePage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= pages.length || fromIndex === toIndex) return;

        const nextPages = [...pages];
        const [movedPage] = nextPages.splice(fromIndex, 1);
        nextPages.splice(toIndex, 0, movedPage);
        onChange(nextPages);
    };

    const handleDrop = (targetId: string) => {
        if (!draggedId || draggedId === targetId) {
            setDraggedId(null);
            setDragOverId(null);
            return;
        }

        const fromIndex = pages.findIndex((page) => page.id === draggedId);
        const toIndex = pages.findIndex((page) => page.id === targetId);
        movePage(fromIndex, toIndex);
        setDraggedId(null);
        setDragOverId(null);
    };

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
                <Loader2 className="animate-spin text-[var(--accent)]" size={28} />
                <p className="text-sm">Loading page previews...</p>
            </div>
        );
    }

    if (pages.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                Page previews will appear here after both PDFs are uploaded.
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">Page order</h3>
                    <p className="text-xs text-[var(--text-muted)]">Drag pages to change the final merged PDF order.</p>
                </div>
                <div className="text-xs text-[var(--text-faint)]">{pages.length} pages selected</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {pages.map((page, index) => {
                    const itemClasses = [
                        "group bg-[var(--surface)] border rounded overflow-hidden transition-smooth",
                        dragOverId === page.id
                            ? "border-[var(--accent)] ring-2 ring-[var(--accent-ring)]"
                            : "border-[var(--border-strong)] hover:border-[var(--accent)]",
                        draggedId === page.id ? "opacity-55" : "",
                    ].join(" ");

                    return (
                        <div
                            key={page.id}
                            draggable
                            onDragStart={(event) => {
                                setDraggedId(page.id);
                                event.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnd={() => {
                                setDraggedId(null);
                                setDragOverId(null);
                            }}
                            onDragOver={(event) => {
                                event.preventDefault();
                                if (dragOverId !== page.id) setDragOverId(page.id);
                            }}
                            onDrop={() => handleDrop(page.id)}
                            className={itemClasses}
                        >
                            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                <div className="flex items-center gap-2 min-w-0">
                                    <GripVertical className="text-[var(--text-faint)] shrink-0" size={16} />
                                    <span className="text-xs font-semibold text-[var(--text)]">#{index + 1}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => movePage(index, index - 1)}
                                        disabled={index === 0}
                                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-30"
                                        title="Move page up"
                                        aria-label="Move page up"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => movePage(index, index + 1)}
                                        disabled={index === pages.length - 1}
                                        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] disabled:opacity-30"
                                        title="Move page down"
                                        aria-label="Move page down"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                    {onRemovePage && (
                                        <button
                                            type="button"
                                            onClick={() => onRemovePage(page.id)}
                                            className="p-1 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10"
                                            title="Remove page"
                                            aria-label="Remove page"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="aspect-[3/4] bg-[var(--bg)] p-3 flex items-center justify-center">
                                <img
                                    src={page.imageUrl}
                                    alt={page.fileName + " page " + (page.pageIndex + 1)}
                                    className="max-w-full max-h-full object-contain shadow-sm border border-[var(--border)] bg-white"
                                    draggable={false}
                                />
                            </div>

                            <div className="px-3 py-2 border-t border-[var(--border)] bg-[var(--surface)]">
                                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] min-w-0">
                                    <FileText size={13} className="shrink-0" />
                                    <span className="truncate">{page.fileName}</span>
                                </div>
                                <p className="text-xs text-[var(--text-faint)] mt-0.5">Original page {page.pageIndex + 1}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
