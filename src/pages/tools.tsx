import React, { useState, useRef, useEffect } from "react";
import {
    Upload,
    FileText,
    Scissors,
    Merge,
    FileSpreadsheet,
    Image,
    Lock,
    Unlock,
    RotateCw,
    Loader2,
    Edit,
    Mic,
    Sparkles,
    Music,
    Presentation,
    FileType,
    Search,
    FileCode,
    Video,
    Type,
    Minimize2,
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
    const [searchQuery, setSearchQuery] = useState("");
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
        const droppedFiles = Array.from(e.dataTransfer.files);
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
            showToast("Please select valid files", "error");
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

    const handleGenericConversion = async (apiCall: (id: string) => Promise<any>, successMsg: string) => {
        if (files.length === 0) {
            showToast("Please upload a file first", "error");
            return;
        }
        setLoading(true);
        try {
            const response = await apiCall(files[0]._id);
            showToast(successMsg, "success");
            if (response.file) {
                setFiles([response.file, ...files]);
                window.open(fileAPI.getDownloadUrl(response.file.filename), "_blank");
            }
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

    const categories = [
        {
            title: "📄 Document & PDF Management",
            description: "Edit, split, compress, and secure your files",
            items: [
                { icon: Merge, title: "Merge PDF", action: handleMergePDFs, gradient: "from-blue-500 to-cyan-500", description: "Combine multiple PDF documents into a single file." },
                { icon: Scissors, title: "Split PDF", action: handleSplitPDF, gradient: "from-purple-500 to-pink-500", description: "Separate pages from a PDF or save each page individually." },
                { icon: Minimize2, title: "Compress PDF", action: handleCompressPDF, gradient: "from-red-500 to-pink-500", description: "Reduce the file size of your PDF documents." },
                {
                    icon: Edit, title: "Advanced PDF Editor", action: () => {
                        if (files.length === 0) { showToast("Please upload a PDF to edit", "error"); return; }
                        window.location.href = `/editor/${files[0]._id}`;
                    }, gradient: "from-pink-500 to-rose-500", description: "Annotate, draw, and modify text on your PDF pages visually."
                },
                { icon: Lock, title: "Protect PDF", action: handleProtectPDF, gradient: "from-yellow-500 to-orange-500", description: "Encrypt and secure your PDFs with a custom password." },
                { icon: Unlock, title: "Unlock PDF / Remove PW", action: () => (window.location.href = "/pdf-unlock"), gradient: "from-amber-500 to-orange-600", description: "Decrypt password protected PDFs and strip passwords." },
                { icon: RotateCw, title: "Rotate PDF", action: handleRotatePDF, gradient: "from-teal-500 to-cyan-500", description: "Rotate PDF pages clockwise or counter-clockwise." },
                { icon: Image, title: "PDF to Image", action: handleToImage, gradient: "from-indigo-500 to-purple-500", description: "Extract pages from your PDF as high-resolution images." }
            ]
        },
        {
            title: "🔄 Document & Audio Converters",
            description: "Convert office docs, transcripts, speech, and web layouts",
            items: [
                { icon: FileText, title: "PDF to Word", action: handleToWord, gradient: "from-green-500 to-emerald-500", description: "Convert PDF documents to editable Microsoft Word files." },
                { icon: FileText, title: "Word to PDF", action: () => handleGenericConversion(fileAPI.wordToPdf, "Word converted to PDF!"), gradient: "from-blue-500 to-indigo-500", description: "Transform .docx files into standard PDF format." },
                { icon: FileSpreadsheet, title: "PDF to Excel", action: handleToExcel, gradient: "from-orange-500 to-yellow-500", description: "Extract tabular data from PDFs to spreadsheets." },
                { icon: Presentation, title: "PowerPoint to PDF", action: () => handleGenericConversion(fileAPI.pptToPdf, "PPT converted to PDF!"), gradient: "from-orange-500 to-red-500", description: "Convert presentation slides into PDF pages." },
                { icon: FileCode, title: "HTML to PDF", action: () => window.location.href = "/html-to-pdf", gradient: "from-blue-500 to-indigo-600", description: "Convert web layouts and HTML pages to PDF format." },
                { icon: FileCode, title: "PDF to HTML", action: () => (window.location.href = "/pdf-to-html"), gradient: "from-indigo-500 to-violet-500", description: "Export PDF documents into responsive HTML web pages." },
                { icon: FileType, title: "PDF to Text", action: () => window.location.href = "/pdf-to-text", gradient: "from-gray-500 to-slate-500", description: "Extract raw plain text from PDF pages." },
                { icon: Type, title: "Text to PDF", action: () => handleGenericConversion(fileAPI.textToPdf, "Text converted to PDF!"), gradient: "from-stone-500 to-gray-500", description: "Generate a formatted PDF document from raw text input." },
                { icon: FileSpreadsheet, title: "CSV to PDF", action: () => handleGenericConversion(fileAPI.csvToPdf, "CSV converted to PDF!"), gradient: "from-cyan-500 to-blue-500", description: "Transform spreadsheet CSV files into organized PDF pages." },
                { icon: FileSpreadsheet, title: "PDF to CSV", action: () => handleGenericConversion(fileAPI.pdfToCsv, "PDF extracted to CSV!"), gradient: "from-purple-500 to-pink-500", description: "Extract tables and rows from PDFs into CSV format." },
                { icon: Mic, title: "PDF to Speech", action: () => handleGenericConversion(fileAPI.pdfToSpeech, "Generated Speech from PDF!"), gradient: "from-pink-500 to-rose-500", description: "Convert document text into high-fidelity audible voiceovers." },
                { icon: Mic, title: "Speech to PDF", action: () => (window.location.href = "/speech-to-pdf"), gradient: "from-indigo-600 to-blue-600", description: "Convert your live voice into a polished PDF document instantly." },
                { icon: Video, title: "Video to PDF Notes", action: () => handleGenericConversion(fileAPI.videoToPdf, "Generated PDF Notes from Video!"), gradient: "from-purple-500 to-fuchsia-500", description: "Extract slide transitions from video files to study notes." },
                { icon: Music, title: "Audio to Transcript", action: () => handleGenericConversion(fileAPI.audioToPdf, "Transcript generated successfully!"), gradient: "from-indigo-500 to-violet-500", description: "Generate textual transcriptions from voice records." }
            ]
        },
        {
            title: "🖼️ Graphic & Advanced Image Tools",
            description: "Scale, crop, and transform file types offline or hybrid",
            items: [
                { icon: Image, title: "Image Resizer", action: () => (window.location.href = "/image-resizer"), gradient: "from-blue-500 to-indigo-600", description: "Scale and compress dimensions of PNG, JPG, and WebP images client-side." },
                { icon: Scissors, title: "Image Cropper", action: () => (window.location.href = "/image-cropper"), gradient: "from-emerald-500 to-teal-600", description: "Crop and adjust image regions with visual aspect ratio frames." },
                { icon: Image, title: "Image Converter (HEIC, WEBP, JPG, PNG)", action: () => (window.location.href = "/image-converter"), gradient: "from-teal-500 to-cyan-600", description: "Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, PNG to WEBP, and more." },
                { icon: Sparkles, title: "Image to SVG", action: () => window.location.href = "/svg", gradient: "from-fuchsia-500 to-pink-500", description: "Vectorise pixel images into fully scaleable SVG structures." },
                { icon: FileText, title: "OCR Image to PDF", action: () => window.location.href = "/ocr", gradient: "from-sky-500 to-blue-500", description: "Extract scanned letters in images and place them inside searchable PDFs." },
                { icon: Image, title: "Convert to JPG", action: () => handleGenericConversion((id) => fileAPI.imageConvert(id, "jpg"), "Converted to JPG!"), gradient: "from-emerald-400 to-green-500", description: "Convert uploaded files into standard JPEG image records." },
                { icon: Image, title: "Convert to PNG", action: () => handleGenericConversion((id) => fileAPI.imageConvert(id, "png"), "Converted to PNG!"), gradient: "from-teal-400 to-cyan-500", description: "Convert documents to lossless transparent portable network graphics." }
            ]
        },
        {
            title: "✨ Professional Work & AI Assistants",
            description: "Build resumes and generate chart diagrams using AI assistance",
            items: [
                { icon: Sparkles, title: "Create Professional Resume", action: () => (window.location.href = "/resume-builder"), gradient: "from-amber-400 to-orange-600", description: "Build a job-winning resume from scratch or by uploading your old one." },
                { icon: Edit, title: "Pro AI Chart & Diagram Maker", action: () => (window.location.href = "/drowChart"), gradient: "from-blue-600 to-indigo-600", description: "Create flowcharts, DFDs, BPMN, Swimlanes, and logic maps with expert AI." }
            ]
        },
        {
            title: "💻 Developer Utilities & Data Tools",
            description: "Format, validate, parse, compare, and minify development code scopes",
            items: [
                { icon: FileCode, title: "Base64 Encoder/Decoder", action: () => (window.location.href = "/base64"), gradient: "from-indigo-500 to-violet-600", description: "Convert plain text and files to Base64 data strings or decode back." },
                { icon: Lock, title: "JWT Decoder", action: () => (window.location.href = "/jwt"), gradient: "from-purple-500 to-indigo-600", description: "Inspect and decode JSON Web Tokens (JWT) client-side in real-time." },
                { icon: FileCode, title: "JSON Formatter", action: () => (window.location.href = "/json-formatter"), gradient: "from-teal-500 to-emerald-600", description: "Pretty print and beautify raw JSON, or minify JSON payloads." },
                { icon: Sparkles, title: "JSON Validator", action: () => (window.location.href = "/json-validator"), gradient: "from-sky-500 to-blue-600", description: "Check structural syntax validation of JSON documents with line highlights." },
                { icon: FileCode, title: "JSON Diff Checker", action: () => (window.location.href = "/json-diff"), gradient: "from-indigo-600 to-violet-700", description: "Compare baseline and modified JSON structures with color highlights." },
                { icon: FileCode, title: "YAML ↔ JSON Converter", action: () => (window.location.href = "/yaml-json"), gradient: "from-orange-500 to-amber-600", description: "Convert YAML text files to JSON strings and JSON arrays to YAML format." },
                { icon: FileSpreadsheet, title: "CSV ↔ JSON Converter", action: () => (window.location.href = "/csv-json"), gradient: "from-cyan-500 to-teal-600", description: "Transform CSV tabular sheets to JSON array of objects and vice versa." },
                { icon: Search, title: "Regex Tester", action: () => (window.location.href = "/regex-tester"), gradient: "from-purple-500 to-pink-600", description: "Test regular expressions in real-time with visual match highlighting." },
                { icon: FileCode, title: "XML Formatter & Validator", action: () => (window.location.href = "/xml-tool"), gradient: "from-orange-500 to-amber-600", description: "Beautify XML nesting nodes and parse syntax validation errors instantly." },
                { icon: FileCode, title: "SQL Formatter", action: () => (window.location.href = "/sql-formatter"), gradient: "from-sky-500 to-blue-600", description: "Pretty print SQL scripts and capitalize database query statements." },
                { icon: Edit, title: "Visual SQL Query Builder", action: () => (window.location.href = "/sql-query-builder"), gradient: "from-blue-600 to-indigo-700", description: "Create SQL queries visually for SELECT, INSERT, UPDATE, and DELETE tasks." },
                { icon: FileText, title: "Markdown Editor & HTML Converter", action: () => (window.location.href = "/markdown-editor"), gradient: "from-pink-500 to-rose-600", description: "Write rich Markdown and compile it into styled visual HTML codes instantly." },
                { icon: FileCode, title: "Unified Code Minifier", action: () => (window.location.href = "/code-minifier"), gradient: "from-teal-600 to-emerald-700", description: "Compress HTML codes, CSS stylesheets, and Javascript files client-side." }
            ]
        }
    ];

    const filteredCategories = categories.map(category => {
        const items = category.items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        return { ...category, items };
    }).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <Navbar />

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">

                {/* ── Page Header ── */}
                <div className="text-center mb-10 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-5 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Sparkles size={13} />
                        40+ Tools · All Free · No Sign-up
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text tracking-tighter leading-tight mb-4">
                        All Tools
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Browse every tool by category, or search below. Click any card to open the tool directly.
                    </p>

                    {/* ── Search Bar ── */}
                    <div className="flex justify-center mt-8">
                        <div className="relative w-full max-w-lg group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                placeholder="Search tools… (Merge, Regex, SQL, Resize…)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-4 rounded-2xl outline-none focus:border-blue-500/40 focus:bg-white/8 transition-all font-medium text-white placeholder-gray-600"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-bold"
                                >
                                    ✕ Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── PDF Quick-Upload Panel ──
                     Only shown when no search query, so it doesn't clutter search results.
                     Users upload here to use any of the PDF tools that require a file. ── */}
                {!searchQuery && (
                    <Card
                        variant="elevated"
                        className="mb-12 animate-fadeIn border border-white/5"
                        style={{ animationDelay: '0.1s' } as React.CSSProperties}
                    >
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`p-8 md:p-10 text-center transition-all rounded-xl ${isDragging ? "bg-blue-500/10 border-2 border-blue-500" : ""}`}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 p-5 rounded-2xl">
                                    <Upload className="text-blue-400" size={30} />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-white mb-1">
                                        Upload a file to use PDF tools
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Drag & drop PDF, Word, Excel, image, audio, or video here — then pick a tool below
                                    </p>
                                </div>
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    loading={loading}
                                    size="lg"
                                    className="mt-2"
                                >
                                    {loading ? "Processing…" : "Choose File"}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.webp,.svg,.mp3,.mp4,.wav,.avi"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Uploaded file list — inline below the upload area */}
                        {files.length > 0 && (
                            <div className="border-t border-white/5 px-6 py-4">
                                <FileList
                                    files={files}
                                    onRemove={handleRemoveFile}
                                    onDownload={handleDownloadFile}
                                />
                            </div>
                        )}
                    </Card>
                )}

                {/* ── Categorised Tool Directory ── */}
                <div className="space-y-14 mb-12">
                    {filteredCategories.map((category, catIdx) => (
                        <div
                            key={catIdx}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${0.15 + catIdx * 0.05}s` } as React.CSSProperties}
                        >
                            {/* Category header */}
                            <div className="flex items-end justify-between mb-5 pb-3 border-b border-white/5">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                                        {category.title}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
                                </div>
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest shrink-0 ml-4">
                                    {category.items.length} tool{category.items.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Tool cards grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {category.items.map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="transition-all duration-200 hover:-translate-y-1"
                                        style={{ animationDelay: `${0.2 + idx * 0.02}s` } as React.CSSProperties}
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
                    ))}

                    {/* Empty search state */}
                    {filteredCategories.length === 0 && (
                        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
                            <Search size={40} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-500 font-semibold text-lg">No tools found for "{searchQuery}"</p>
                            <p className="text-xs text-gray-600 mt-2">Try: Merge · Resize · SQL · Regex · Markdown</p>
                            <button onClick={() => setSearchQuery('')} className="mt-5 text-xs text-blue-500 hover:text-blue-400 font-bold underline underline-offset-4">
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Footer Banner ── */}
                <Card
                    variant="elevated"
                    className="p-6 relative overflow-hidden animate-fadeIn border border-white/5"
                    style={{ animationDelay: '0.8s' } as React.CSSProperties}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 to-indigo-600/15" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-white text-base">🔒 Secure & Private</p>
                            <p className="text-sm text-gray-400 mt-0.5">All files are encrypted in transit and automatically deleted after 1 hour. Nothing is stored permanently.</p>
                        </div>
                        <Button variant="secondary" className="shrink-0">
                            Learn More
                        </Button>
                    </div>
                </Card>
            </div>

            {/* ── Protect PDF Password Modal ── */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <Card variant="elevated" className="p-6 w-96 max-w-[90vw]">
                        <h3 className="text-xl font-bold text-white mb-4">Protect PDF</h3>
                        <p className="text-gray-400 mb-4">Enter a password to encrypt this PDF.</p>
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
                                onClick={() => { setShowPasswordModal(false); setPassword(""); }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={confirmProtectPDF}>Protect</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}


