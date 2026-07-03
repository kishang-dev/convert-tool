import { useRouter } from "next/router";
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
import SEO from "@/components/SEO";


export default function Tools() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const categories = [
        {
            title: "📄 Document & PDF Management",
            description: "Edit, split, compress, and secure your files",
            items: [
                { icon: Merge, title: "Merge PDF", action: () => router.push("/merge-pdf"), gradient: "from-blue-500 to-cyan-500", description: "Combine multiple PDF documents into a single file." },
                { icon: Scissors, title: "Split PDF", action: () => router.push("/split-pdf"), gradient: "from-purple-500 to-pink-500", description: "Separate pages from a PDF or save each page individually." },
                { icon: Minimize2, title: "Compress PDF", action: () => router.push("/compress-pdf"), gradient: "from-red-500 to-pink-500", description: "Reduce the file size of your PDF documents." },
                {
                    icon: Edit, title: "Advanced PDF Editor", action: () => {
                        router.push(`/editor`);
                    }, gradient: "from-pink-500 to-rose-500", description: "Annotate, draw, and modify text on your PDF pages visually."
                },
                { icon: Lock, title: "Protect PDF", action: () => router.push("/protect-pdf"), gradient: "from-yellow-500 to-orange-500", description: "Encrypt and secure your PDFs with a custom password." },
                { icon: Unlock, title: "Unlock PDF / Remove PW", action: () => router.push("/pdf-unlock"), gradient: "from-amber-500 to-orange-600", description: "Decrypt password protected PDFs and strip passwords." },
                { icon: RotateCw, title: "Rotate PDF", action: () => router.push("/rotate-pdf"), gradient: "from-teal-500 to-cyan-500", description: "Rotate PDF pages clockwise or counter-clockwise." },
                { icon: Image, title: "PDF to Image", action: () => router.push("/pdf-to-image"), gradient: "from-indigo-500 to-purple-500", description: "Extract pages from your PDF as high-resolution images." }
            ]
        },
        {
            title: "🔄 Document & Audio Converters",
            description: "Convert office docs, transcripts, speech, and web layouts",
            items: [
                { icon: FileText, title: "PDF to Word", action: () => router.push("/pdf-to-word"), gradient: "from-green-500 to-emerald-500", description: "Convert PDF documents to editable Microsoft Word files." },
                { icon: FileText, title: "Word to PDF", action: () => router.push("/word-to-pdf"), gradient: "from-blue-500 to-indigo-500", description: "Transform .docx files into standard PDF format." },
                { icon: FileSpreadsheet, title: "PDF to Excel", action: () => router.push("/pdf-to-excel"), gradient: "from-orange-500 to-yellow-500", description: "Extract tabular data from PDFs to spreadsheets." },
                { icon: Presentation, title: "PowerPoint to PDF", action: () => router.push("/ppt-to-pdf"), gradient: "from-orange-500 to-red-500", description: "Convert presentation slides into PDF pages." },
                { icon: FileCode, title: "HTML to PDF", action: () => router.push("/html-to-pdf"), gradient: "from-blue-500 to-indigo-600", description: "Convert web layouts and HTML pages to PDF format." },
                { icon: FileCode, title: "PDF to HTML", action: () => router.push("/pdf-to-html"), gradient: "from-indigo-500 to-violet-500", description: "Export PDF documents into responsive HTML web pages." },
                { icon: FileType, title: "PDF to Text", action: () => router.push("/pdf-to-text"), gradient: "from-gray-500 to-slate-500", description: "Extract raw plain text from PDF pages." },
                { icon: Type, title: "Text to PDF", action: () => router.push("/text-to-pdf"), gradient: "from-stone-500 to-gray-500", description: "Generate a formatted PDF document from raw text input." },
                { icon: FileSpreadsheet, title: "CSV to PDF", action: () => router.push("/csv-to-pdf"), gradient: "from-cyan-500 to-blue-500", description: "Transform spreadsheet CSV files into organized PDF pages." },
                { icon: FileSpreadsheet, title: "PDF to CSV", action: () => router.push("/pdf-to-csv"), gradient: "from-purple-500 to-pink-500", description: "Extract tables and rows from PDFs into CSV format." },
                { icon: Mic, title: "PDF to Speech", action: () => router.push("/pdf-to-speech"), gradient: "from-pink-500 to-rose-500", description: "Convert document text into high-fidelity audible voiceovers." },
                { icon: Mic, title: "Speech to PDF", action: () => router.push("/speech-to-pdf"), gradient: "from-indigo-600 to-blue-600", description: "Convert your live voice into a polished PDF document instantly." },
                { icon: Video, title: "Video to PDF Notes", action: () => router.push("/video-to-pdf"), gradient: "from-purple-500 to-fuchsia-500", description: "Extract slide transitions from video files to study notes." },
                { icon: Music, title: "Audio to Transcript", action: () => router.push("/audio-to-transcript"), gradient: "from-indigo-500 to-violet-500", description: "Generate textual transcriptions from voice records." }
            ]
        },
        {
            title: "🖼️ Graphic & Advanced Image Tools",
            description: "Scale, crop, and transform file types offline or hybrid",
            items: [
                { icon: Image, title: "Image Resizer", action: () => router.push("/image-resizer"), gradient: "from-blue-500 to-indigo-600", description: "Scale and compress dimensions of PNG, JPG, and WebP images client-side." },
                { icon: Scissors, title: "Image Cropper", action: () => router.push("/image-cropper"), gradient: "from-emerald-500 to-teal-600", description: "Crop and adjust image regions with visual aspect ratio frames." },
                { icon: Image, title: "Image Converter (HEIC, WEBP, JPG, PNG)", action: () => router.push("/image-converter"), gradient: "from-teal-500 to-cyan-600", description: "Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, PNG to WEBP, and more." },
                { icon: Sparkles, title: "Image to SVG", action: () => router.push("/svg"), gradient: "from-fuchsia-500 to-pink-500", description: "Vectorise pixel images into fully scaleable SVG structures." },
                { icon: FileText, title: "OCR Image to PDF", action: () => router.push("/ocr"), gradient: "from-sky-500 to-blue-500", description: "Extract scanned letters in images and place them inside searchable PDFs." },
                { icon: Image, title: "Convert to JPG", action: () => router.push("/convert-to-jpg"), gradient: "from-emerald-400 to-green-500", description: "Convert uploaded files into standard JPEG image records." },
                { icon: Image, title: "Convert to PNG", action: () => router.push("/convert-to-png"), gradient: "from-teal-400 to-cyan-500", description: "Convert documents to lossless transparent portable network graphics." }
            ]
        },
        {
            title: "✨ Professional Work & AI Assistants",
            description: "Build resumes and generate chart diagrams using AI assistance",
            items: [
                { icon: Sparkles, title: "Create Professional Resume", action: () => router.push("/resume-builder"), gradient: "from-amber-400 to-orange-600", description: "Build a job-winning resume from scratch or by uploading your old one." },
                { icon: Edit, title: "Pro AI Chart & Diagram Maker", action: () => router.push("/drowChart"), gradient: "from-blue-600 to-indigo-600", description: "Create flowcharts, DFDs, BPMN, Swimlanes, and logic maps with expert AI." }
            ]
        },
        {
            title: "💻 Developer Utilities & Data Tools",
            description: "Format, validate, parse, compare, and minify development code scopes",
            items: [
                { icon: FileCode, title: "Base64 Encoder/Decoder", action: () => router.push("/base64"), gradient: "from-indigo-500 to-violet-600", description: "Convert plain text and files to Base64 data strings or decode back." },
                { icon: Lock, title: "JWT Decoder", action: () => router.push("/jwt"), gradient: "from-purple-500 to-indigo-600", description: "Inspect and decode JSON Web Tokens (JWT) client-side in real-time." },
                { icon: FileCode, title: "JSON Formatter", action: () => router.push("/json-formatter"), gradient: "from-teal-500 to-emerald-600", description: "Pretty print and beautify raw JSON, or minify JSON payloads." },
                { icon: Sparkles, title: "JSON Validator", action: () => router.push("/json-validator"), gradient: "from-sky-500 to-blue-600", description: "Check structural syntax validation of JSON documents with line highlights." },
                { icon: FileCode, title: "JSON Diff Checker", action: () => router.push("/json-diff"), gradient: "from-indigo-600 to-violet-700", description: "Compare baseline and modified JSON structures with color highlights." },
                { icon: FileCode, title: "YAML ↔ JSON Converter", action: () => router.push("/yaml-json"), gradient: "from-orange-500 to-amber-600", description: "Convert YAML text files to JSON strings and JSON arrays to YAML format." },
                { icon: FileSpreadsheet, title: "CSV ↔ JSON Converter", action: () => router.push("/csv-json"), gradient: "from-cyan-500 to-teal-600", description: "Transform CSV tabular sheets to JSON array of objects and vice versa." },
                { icon: Search, title: "Regex Tester", action: () => router.push("/regex-tester"), gradient: "from-purple-500 to-pink-600", description: "Test regular expressions in real-time with visual match highlighting." },
                { icon: FileCode, title: "XML Formatter & Validator", action: () => router.push("/xml-tool"), gradient: "from-orange-500 to-amber-600", description: "Beautify XML nesting nodes and parse syntax validation errors instantly." },
                { icon: FileCode, title: "SQL Formatter", action: () => router.push("/sql-formatter"), gradient: "from-sky-500 to-blue-600", description: "Pretty print SQL scripts and capitalize database query statements." },
                { icon: Edit, title: "Visual SQL Query Builder", action: () => router.push("/sql-query-builder"), gradient: "from-blue-600 to-indigo-700", description: "Create SQL queries visually for SELECT, INSERT, UPDATE, and DELETE tasks." },
                { icon: FileText, title: "Markdown Editor & HTML Converter", action: () => router.push("/markdown-editor"), gradient: "from-pink-500 to-rose-600", description: "Write rich Markdown and compile it into styled visual HTML codes instantly." },
                { icon: FileCode, title: "Unified Code Minifier", action: () => router.push("/code-minifier"), gradient: "from-teal-600 to-emerald-700", description: "Compress HTML codes, CSS stylesheets, and Javascript files client-side." }
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
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                title="All Free Online Tools"
                description="Browse 40+ free online tools — PDF converter, image resizer, JSON formatter, resume builder, OCR, and more. No sign-up, no watermarks. Instant processing in your browser."
                canonical="/tools"
                keywords="free PDF tools, PDF converter online, image resizer, JSON formatter, resume builder, OCR online, merge PDF, compress PDF, ToolBasketAI tools"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'All Free Online Tools — ToolBasketAI',
                    url: 'https://toolbasketai.com/tools',
                    description: '40+ free online document and PDF tools with no sign-up required.',
                }}
            />
            <Navbar />

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 py-24 md:py-32">

                {/* ── Page Header ── */}
                <header className="text-center mb-10 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border-strong)] rounded-full mb-5 text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.15em]">
                        <Sparkles size={11} />
                        40+ Tools &middot; All Free &middot; No Sign-up
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] dark:text-[var(--text)] tracking-tight leading-tight mb-4">
                        All Tools
                    </h1>
                    <p className="text-[var(--text-muted)] text-base max-w-xl mx-auto leading-relaxed">
                        Browse every tool by category, or search below.
                    </p>

                    {/* Search Bar */}
                    <div className="flex justify-center mt-6">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-faint)]" size={17} />
                            <input
                                placeholder="Search tools…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border-strong)] dark:border-[var(--border)] p-3 pl-10 pr-10 rounded outline-none focus:border-[var(--border-strong)] dark:border-[var(--border-strong)] transition-colors text-sm text-[var(--text)] dark:text-[var(--text)] placeholder-[#444]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-xs"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Removed common file upload panel */}

                {/* Category Directory */}
                <div className="space-y-12 mb-12">
                    {filteredCategories.map((category, catIdx) => (
                        <section
                            key={catIdx}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${0.1 + catIdx * 0.04}s` } as React.CSSProperties}
                        >
                            {/* Category header */}
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                                <div>
                                    <h2 className="text-base font-semibold text-[var(--text)]">{category.title}</h2>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{category.description}</p>
                                </div>
                                <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest shrink-0 ml-4">
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
                        </section>
                    ))}

                    {/* Empty search state */}
                    {filteredCategories.length === 0 && (
                        <div className="text-center py-16 bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded">
                            <Search size={32} className="mx-auto mb-3 text-[var(--text-muted)]" />
                            <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] font-medium">No tools found for &ldquo;{searchQuery}&rdquo;</p>
                            <button onClick={() => setSearchQuery('')} className="mt-4 text-xs text-[var(--text)] dark:text-[var(--text)] hover:text-[var(--text-muted)] dark:text-[var(--text-faint)] font-medium underline underline-offset-4">
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Banner */}
                <aside className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
                    <div>
                        <h2 className="font-semibold text-[var(--text)] dark:text-[var(--text)] text-sm">🔒 Secure & Private</h2>
                        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] mt-0.5">All files are encrypted in transit and auto-deleted after 1 hour. Nothing is stored permanently.</p>
                    </div>
                </aside>
            </main>

            {/* Modals removed because they moved to specific tool pages */}
        </div>
    );
}


