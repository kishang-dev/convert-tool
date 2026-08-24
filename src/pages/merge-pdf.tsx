import React, { useState } from "react";
import { useRouter } from "next/router";
import { LuArrowLeft as ArrowLeft, LuFileText as FileText, LuTrash2 as Trash2 } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import PdfUploadDropzone from "@/components/PdfUploadDropzone";
import PdfPageOrganizer, { PdfPreviewPage } from "@/components/PdfPageOrganizer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { fileAPI, FileData } from "@/lib/api";
import * as gtag from "@/lib/gtag";

const MAX_FILES = 50;

const getAssetUrl = (url: string) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;

    const baseUrl = (
        process.env.NEXT_PUBLIC_ASSETS_URL ||
        process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        ""
    ).replace(/\/$/, "");

    return baseUrl + (url.startsWith("/") ? url : "/" + url);
};

const cacheBust = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return url + separator + "v=" + Date.now();
};

const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function MergePdf() {
    const router = useRouter();
    const [files, setFiles] = useState<FileData[]>([]);
    const [pages, setPages] = useState<PdfPreviewPage[]>([]);
    const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
    const [uploading, setUploading] = useState(false);
    const [loadingPreviews, setLoadingPreviews] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadPreviewsForFiles = async (uploadedFiles: FileData[]) => {
        setLoadingPreviews(true);
        try {
            const nextPageCounts: Record<string, number> = {};
            const previewGroups = await Promise.all(
                uploadedFiles.map(async (file) => {
                    const previews = await fileAPI.getPreviewImages(file._id);
                    const images = previews.images || [];
                    nextPageCounts[file._id] = images.length;

                    return images.map((url, pageIndex) => ({
                        id: file._id + "-" + pageIndex,
                        fileId: file._id,
                        fileName: file.originalName,
                        pageIndex,
                        imageUrl: cacheBust(getAssetUrl(url)),
                    }));
                })
            );

            const nextPages = previewGroups.flat();
            if (nextPages.length === 0) {
                showToast("No page previews were returned for the uploaded PDFs.", "error");
                return;
            }

            setPageCounts((prev) => ({ ...prev, ...nextPageCounts }));
            setPages((prev) => [...prev, ...nextPages]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Failed to load PDF previews.", "error");
        } finally {
            setLoadingPreviews(false);
        }
    };

    const handleFilesSelected = async (selectedFiles: File[]) => {
        if (selectedFiles.length === 0) return;

        const pdfFiles = selectedFiles.filter(
            (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
        );

        if (pdfFiles.length !== selectedFiles.length) {
            showToast("Please upload PDF files only.", "error");
            return;
        }

        if (files.length + pdfFiles.length > MAX_FILES) {
            showToast(`Please upload up to ${MAX_FILES} PDFs for this merge flow.`, "error");
            return;
        }

        setUploading(true);
        try {
            const response = await fileAPI.uploadFiles(pdfFiles);
            setFiles((prev) => [...prev, ...response.files]);
            showToast(response.files.length + " PDF file(s) uploaded successfully.");
            await loadPreviewsForFiles(response.files);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Upload failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = async (fileId: string) => {
        try {
            await fileAPI.hideFile(fileId);
        } catch (error) {
            console.error("Failed to hide uploaded PDF", error);
        }

        setFiles((prev) => prev.filter((file) => file._id !== fileId));
        setPageCounts((prev) => {
            const next = { ...prev };
            delete next[fileId];
            return next;
        });
        setPages((prev) => prev.filter((page) => page.fileId !== fileId));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            showToast("Upload at least 2 PDFs before merging.", "error");
            return;
        }

        if (pages.length === 0) {
            showToast("No pages are selected for merging.", "error");
            return;
        }

        setProcessing(true);
        try {
            let runningPageOffset = 0;
            const filePageOffsets = files.reduce<Record<string, number>>((offsets, file) => {
                offsets[file._id] = runningPageOffset;
                runningPageOffset += pageCounts[file._id] || 0;
                return offsets;
            }, {});

            const response = await fileAPI.mergePDFs(files.map((file) => file._id));
            let finalFile = response.file;
            let finalDownloadUrl = response.downloadUrl ? getAssetUrl(response.downloadUrl) : "";

            if (response.file?._id) {
                const reorderedPages = pages.map((page) => ({
                    index: filePageOffsets[page.fileId] + page.pageIndex,
                    rotation: page.rotation || 0,
                }));

                const reorderedResponse = await fileAPI.editPDF(response.file._id, reorderedPages);
                finalFile = reorderedResponse.file;
                finalDownloadUrl = reorderedResponse.downloadUrl
                    ? getAssetUrl(reorderedResponse.downloadUrl)
                    : reorderedResponse.file
                        ? fileAPI.getDownloadUrl(reorderedResponse.file)
                        : finalDownloadUrl;
            }

            gtag.event({
                action: "use_tool",
                category: "Tool",
                label: "merge-pdf",
            });

            showToast("PDF merged successfully.");

            const downloadUrl = finalDownloadUrl || (finalFile ? fileAPI.getDownloadUrl(finalFile) : "");

            if (downloadUrl) {
                window.open(downloadUrl, "_blank", "noopener,noreferrer");
            }
        } catch (error: any) {
            showToast(error.response?.data?.error || "Merge failed. Please try again.", "error");
        } finally {
            setProcessing(false);
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Merge PDF",
        description: "Upload multiple PDFs, preview every page, reorder pages with drag and drop, then merge them into one PDF.",
        applicationCategory: "BrowserApplication",
        operatingSystem: "All",
        url: "https://toolbasketai.com/merge-pdf",
        offers: {
            "@type": "Offer",
            price: "0.00",
            priceCurrency: "USD",
        },
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="Merge PDF Online Free - Combine PDF Files & Rearrange Pages"
                description="Combine multiple PDF files into one document for free. Drag and drop reorder, preview individual pages, and merge unlimited PDFs with 100% privacy."
                canonicalUrl="https://toolbasketai.com/merge-pdf"
                keywords={["merge pdf", "combine pdf files", "pdf joiner online", "free pdf merger", "reorder pdf pages"]}
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'PDF Tools', item: '/#pdf-tools' },
                    { name: 'Merge PDF', item: '/merge-pdf' }
                ]}
                structuredData={structuredData}
            />
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs
                    items={[
                        { label: 'Merge PDF', href: '/merge-pdf' }
                    ]}
                />

                <div className="mb-6 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Merge PDF</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Upload multiple PDFs, preview every page from all files, drag pages into the order you want, then merge.
                    </p>
                </div>

                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />

                <section className="bg-[var(--surface)] border border-[var(--border-strong)] rounded overflow-hidden animate-fadeIn">
                    {files.length < MAX_FILES && (
                        <PdfUploadDropzone
                            maxFiles={MAX_FILES}
                            loading={uploading}
                            disabled={processing || loadingPreviews}
                            title={files.length === 0 ? "Upload PDF files" : "Upload more PDFs"}
                            description="Click to upload or drag and drop PDF files here"
                            onFilesSelected={handleFilesSelected}
                        />
                    )}

                    {files.length > 0 && (
                        <div className="p-4 sm:p-6 border-b border-[var(--border-strong)]">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <h3 className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                                    Uploaded PDFs ({files.length}/{MAX_FILES})
                                </h3>
                                <p className="text-xs text-[var(--text-faint)]">Remove a file to upload a different one.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {files.map((file) => (
                                    <div
                                        key={file._id}
                                        className="flex items-center justify-between gap-3 p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="p-2 rounded bg-[var(--accent-soft)] text-[var(--accent)] shrink-0">
                                                <FileText size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm text-[var(--text)] truncate">{file.originalName}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{formatSize(file.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(file._id)}
                                            disabled={processing}
                                            className="p-2 rounded text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 disabled:opacity-40"
                                            title="Remove PDF"
                                            aria-label="Remove PDF"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <PdfPageOrganizer
                        pages={pages}
                        loading={loadingPreviews}
                        onChange={setPages}
                        onRemovePage={(pageId) => setPages((prev) => prev.filter((page) => page.id !== pageId))}
                        onClearAll={() => {
                            setFiles([]);
                            setPages([]);
                            setPageCounts({});
                        }}
                    />

                    <div className="p-4 sm:p-6 border-t border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-sm text-[var(--text-muted)]">
                            Final PDF will use the page order shown above.
                        </p>
                        <Button
                            variant="accent"
                            size="md"
                            onClick={handleMerge}
                            disabled={files.length < 2 || pages.length === 0 || uploading || loadingPreviews || processing}
                            loading={processing}
                            className="min-w-[160px]"
                        >
                            {processing ? "Merging..." : "Merge PDF"}
                        </Button>
                    </div>
                </section>

                <ToolSEOContent
                    toolName="Merge PDF"
                    toolDescription="Upload multiple PDFs, preview every page, reorder pages with drag and drop, and create one merged PDF."
                    steps={[
                        { name: "Upload PDFs", text: "Upload the PDF files you want to combine." },
                        { name: "Arrange Pages", text: "Preview every page and drag pages into the final order." },
                        { name: "Merge", text: "Create and download the merged PDF instantly." },
                    ]}
                />
            </main>
            <Footer />
        </div>
    );
}
