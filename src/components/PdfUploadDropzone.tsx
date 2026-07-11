import React, { useRef, useState } from "react";
import { LuUpload as Upload } from "react-icons/lu";

interface PdfUploadDropzoneProps {
    accept?: string;
    disabled?: boolean;
    loading?: boolean;
    maxFiles?: number;
    title?: string;
    description?: string;
    onFilesSelected: (files: File[]) => void;
}

export default function PdfUploadDropzone({
    accept = ".pdf",
    disabled = false,
    loading = false,
    maxFiles = 2,
    title = "Upload PDF files",
    description = "Click to upload or drag and drop PDFs here",
    onFilesSelected,
}: PdfUploadDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList || disabled || loading) return;
        onFilesSelected(Array.from(fileList));
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    const containerClasses = [
        "p-8 sm:p-10 border-b border-[var(--border-strong)] text-center transition-all",
        disabled || loading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-[var(--surface-hover)]",
        isDragging ? "bg-[var(--accent-soft)] border-dashed border-2 border-[var(--accent)]" : "",
    ].join(" ");

    return (
        <div
            onDragOver={(event) => {
                event.preventDefault();
                if (!disabled && !loading) setIsDragging(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDrop={handleDrop}
            onClick={() => !disabled && !loading && inputRef.current?.click()}
            className={containerClasses}
        >
            <div className="flex flex-col items-center gap-3">
                <div className="bg-[var(--surface-hover)] border border-[var(--border-strong)] p-4 rounded">
                    <Upload className="text-[var(--text)]" size={24} />
                </div>
                <div>
                    <h2 className="text-[var(--text)] font-medium mb-1">{loading ? "Uploading..." : title}</h2>
                    <p className="text-[var(--text-muted)] text-sm">{description}</p>
                    <p className="text-[var(--text-faint)] text-xs mt-1">PDF only, max {maxFiles} files</p>
                </div>
            </div>
            <input
                ref={inputRef}
                type="file"
                multiple={maxFiles > 1}
                accept={accept}
                onChange={(event) => {
                    handleFiles(event.target.files);
                    event.target.value = "";
                }}
                className="hidden"
            />
        </div>
    );
}
