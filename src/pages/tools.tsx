"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Upload,
    FileText,
    Scissors,
    Merge,
    FileSpreadsheet,
    Image,
    Lock,
    RotateCw,
    Loader2,
    Edit,
    Mic,
    Sparkles,
    Minimize2,
    Presentation,
    FileType,
    Search,
    FileCode,
} from "lucide-react";
import { fileAPI, FileData } from "@/lib/api";
import Toast from "@/components/Toast";
import FeatureCard from "@/components/FeatureCard";
import FileList from "@/components/FileList";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Tools() {
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load files on mount
    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        try {
            const response = await fileAPI.getAllFiles();
            setFiles(response.files || []);
        } catch (error) {
            console.error("Failed to load files:", error);
        }
    };

    const showToast = (
        message: string,
        type: "success" | "error" = "success",
    ) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            (file) => file.type === "application/pdf",
        );
        await handleFiles(droppedFiles);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            await handleFiles(selectedFiles);
        }
    };

    const handleFiles = async (newFiles: File[]) => {
        if (newFiles.length === 0) {
            showToast("Please select PDF files only", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.uploadFiles(newFiles);
            setFiles([...response.files, ...files]);
            showToast(`${newFiles.length} file(s) uploaded successfully!`, "success");
        } catch (error: any) {
            showToast(
                error.response?.data?.error || "Upload failed. Please try again.",
                "error",
            );
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleMergePDFs = async () => {
        if (files.length < 2) {
            showToast("Please upload at least 2 PDF files to merge", "error");
            return;
        }

        setLoading(true);
        try {
            const fileIds = files.map((f) => f._id);
            const response = await fileAPI.mergePDFs(fileIds);
            showToast("PDFs merged successfully!", "success");
            setFiles([response.file, ...files]);
            window.open(fileAPI.getDownloadUrl(response.file.filename), "_blank");
        } catch (error: any) {
            showToast(
                error.response?.data?.error || "Merge failed. Please try again.",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSplitPDF = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to split", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.splitPDF(files[0]._id);
            showToast("PDF split successfully!", "success");
            setFiles([...response.files, ...files]);
        } catch (error: any) {
            showToast(
                error.response?.data?.error || "Split failed. Please try again.",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRotatePDF = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to rotate", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.rotatePDF(files[0]._id);
            showToast("PDF rotated successfully!", "success");
            setFiles([response.file, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Rotate failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCompressPDF = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to compress", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.compressPDF(files[0]._id);
            showToast("PDF compressed successfully!", "success");
            setFiles([response.file, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Compression failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleToWord = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to convert", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.convertToWord(files[0]._id);
            showToast("Converted to Word successfully!", "success");
            setFiles([response.file, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Conversion failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleToExcel = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to convert", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.convertToExcel(files[0]._id);
            showToast("Converted to Excel successfully!", "success");
            setFiles([response.file, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Conversion failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleToImage = async () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to convert", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fileAPI.convertToImage(files[0]._id);
            showToast("Converted to Image successfully!", "success");
            setFiles([...response.files, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Conversion failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleProtectPDF = () => {
        if (files.length === 0) {
            showToast("Please upload a PDF file to protect", "error");
            return;
        }
        setShowPasswordModal(true);
    };

    const confirmProtectPDF = async () => {
        if (!password) {
            showToast("Password is required", "error");
            return;
        }

        setShowPasswordModal(false);
        setLoading(true);
        try {
            const response = await fileAPI.protectPDF(files[0]._id, password);
            showToast("PDF protected successfully!", "success");
            setFiles([response.file, ...files]);
        } catch (error: any) {
            showToast(error.response?.data?.error || "Protection failed", "error");
        } finally {
            setLoading(false);
            setPassword("");
        }
    };

    const handleRemoveFile = async (id: string) => {
        try {
            await fileAPI.deleteFile(id);
            setFiles(files.filter((f) => f._id !== id));
            showToast("File removed successfully", "success");
        } catch (error: any) {
            showToast(
                error.response?.data?.error || "Failed to remove file",
                "error",
            );
        }
    };

    const handleDownloadFile = (file: FileData) => {
        window.open(fileAPI.getDownloadUrl(file.filename), "_blank");
    };

    const features = [

        { icon: Merge, title: "Merge PDF", action: handleMergePDFs, gradient: "from-blue-500 to-cyan-500" },
        { icon: Scissors, title: "Split PDF", action: handleSplitPDF, gradient: "from-purple-500 to-pink-500" },
        { icon: FileText, title: "PDF to Word", action: handleToWord, gradient: "from-green-500 to-emerald-500" },
        { icon: Minimize2, title: "Compress PDF", action: handleCompressPDF, gradient: "from-red-500 to-pink-500" },
        { icon: Image, title: "PDF to Image", action: handleToImage, gradient: "from-indigo-500 to-purple-500" },
        {
            icon: Edit, title: "Advanced PDF Editor", action: () => {
                if (files.length === 0) {
                    showToast("Please upload a PDF file to edit", "error");
                    return;
                }
                window.location.href = `/editor/${files[0]._id}`;
            }, gradient: "from-pink-500 to-rose-500"
        },
        { icon: Presentation, title: "PDF to PowerPoint", action: () => window.location.href = "/pdf-to-pptx", gradient: "from-orange-500 to-red-500" },
        { icon: FileSpreadsheet, title: "PDF to Excel", action: handleToExcel, gradient: "from-orange-500 to-yellow-500" },
        { icon: Lock, title: "Protect PDF", action: handleProtectPDF, gradient: "from-yellow-500 to-orange-500" },
        { icon: RotateCw, title: "Rotate PDF", action: handleRotatePDF, gradient: "from-teal-500 to-cyan-500" },
        { icon: Mic, title: "Speech to PDF", action: () => window.location.href = "/speech-to-pdf", gradient: "from-violet-500 to-purple-500" },
        { icon: Sparkles, title: "Image to SVG", action: () => window.location.href = "/svg", gradient: "from-fuchsia-500 to-pink-500" },
        { icon: FileText, title: "OCR Image to PDF", action: () => window.location.href = "/ocr", gradient: "from-sky-500 to-blue-500" },
        { icon: FileCode, title: "HTML to PDF", action: () => window.location.href = "/html-to-pdf", gradient: "from-blue-500 to-indigo-600" },
        { icon: FileType, title: "PDF to Text", action: () => window.location.href = "/pdf-to-text", gradient: "from-gray-500 to-slate-500" },
        { icon: FileCode, title: "PDF to HTML", action: () => (window.location.href = "/pdf-to-html"), gradient: "from-indigo-500 to-violet-500" },
        {
            icon: Sparkles,
            title: "Create Professional Resume",
            action: () => (window.location.href = "/resume-builder"),
            gradient: "from-amber-400 to-orange-600",
            description: "Build a job-winning resume from scratch or by uploading your old one."
        },
        {
            icon: Edit,
            title: "Pro Flowchart Maker",
            action: () => (window.location.href = "/drowChart"),
            gradient: "from-blue-600 to-indigo-600",
            description: "Create interactive flowcharts, diagrams, and logic maps easily."
        },

    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-32">
                {/* Page Header */}
                <div className="text-center mb-20 space-y-6 animate-fadeIn">
                    <h1 className="text-6xl font-black gradient-text tracking-tighter">
                        Powerful Tools for Every File
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        Effortlessly edit, convert, and manage your documents with our high-end professional toolset.
                        From AI-powered resumes to advanced PDF editing.
                    </p>
                    <div className="flex justify-center pt-8">
                        <div className="relative w-full max-w-md group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                placeholder="Search all tools (Merge, Resize, Resume...)"
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <Card
                    variant="elevated"
                    className="mb-8 animate-fadeIn"
                    style={{ animationDelay: '0.1s' } as React.CSSProperties}
                >
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`p-12 text-center transition-smooth rounded-xl ${isDragging ? "bg-purple-500/10 border-2 border-purple-500" : ""
                            }`}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-full shadow-lg">
                                <Upload className="text-white" size={48} />
                            </div>
                            <p className="text-xl text-gray-300">
                                Drag & Drop PDF Files Here or
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                loading={loading}
                                size="lg"
                            >
                                {loading ? "Processing..." : "Choose Files"}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </Card>

                {/* File List */}
                <div className="animate-fadeIn" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
                    <FileList
                        files={files}
                        onRemove={handleRemoveFile}
                        onDownload={handleDownloadFile}
                    />
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Available Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="animate-fadeIn"
                                style={{ animationDelay: `${0.3 + idx * 0.05}s` } as React.CSSProperties}
                            >
                                <FeatureCard
                                    icon={feature.icon}
                                    title={feature.title}
                                    onClick={feature.action}
                                    gradient={feature.gradient}
                                    description={feature.description}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Banner */}
                <Card
                    variant="elevated"
                    className="p-6 relative overflow-hidden animate-fadeIn"
                    style={{ animationDelay: '0.8s' } as React.CSSProperties}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="font-semibold text-white text-lg">🔒 Secure & Private</p>
                            <p className="text-sm text-gray-300">All files are encrypted and automatically deleted after 1 hour</p>
                        </div>
                        <Button variant="secondary">
                            Learn More
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <Card variant="elevated" className="p-6 w-96 max-w-[90vw]">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Protect PDF
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Enter a password to encrypt this PDF.
                        </p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 glass rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPassword("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={confirmProtectPDF}>
                                Protect
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
