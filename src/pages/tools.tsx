import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import {
    LuFileText as FileText,
    LuImage as Image,
    LuCode as Code,
    LuScanText as ScanText,
    LuSparkles as Sparkles,
    LuSearch as Search,
    LuArrowRight as ArrowRight
} from 'react-icons/lu';

interface ToolItem {
    id: string;
    title: string;
    description: string;
    category: 'pdf' | 'image' | 'developer' | 'ocr' | 'ai';
    href: string;
    badge?: string;
}

const ALL_TOOLS: ToolItem[] = [
    // PDF Tools
    { id: 'merge-pdf', title: 'Merge PDF', description: 'Combine multiple PDF files into a single document.', category: 'pdf', href: '/merge-pdf', badge: 'Popular' },
    { id: 'split-pdf', title: 'Split PDF', description: 'Extract pages or split a PDF into separate files.', category: 'pdf', href: '/split-pdf', badge: 'Popular' },
    { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce PDF file size without quality loss.', category: 'pdf', href: '/compress-pdf', badge: 'Popular' },
    { id: 'protect-pdf', title: 'Protect PDF', description: 'Encrypt PDFs with a password and permissions.', category: 'pdf', href: '/protect-pdf' },
    { id: 'pdf-unlock', title: 'Unlock PDF', description: 'Remove password and restrictions from PDFs.', category: 'pdf', href: '/pdf-unlock' },
    { id: 'rotate-pdf', title: 'Rotate PDF', description: 'Rotate PDF pages clockwise or counter-clockwise.', category: 'pdf', href: '/rotate-pdf' },
    { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDFs to editable Microsoft Word files.', category: 'pdf', href: '/pdf-to-word', badge: 'Popular' },
    { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert Word documents (.docx) to PDF format.', category: 'pdf', href: '/word-to-pdf' },
    { id: 'pdf-to-excel', title: 'PDF to Excel', description: 'Extract tables from PDF into Excel spreadsheets.', category: 'pdf', href: '/pdf-to-excel' },
    { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Convert Excel spreadsheets (.xlsx) to PDF.', category: 'pdf', href: '/excel-to-pdf' },
    { id: 'pdf-to-pptx', title: 'PDF to PPTX', description: 'Convert PDF slides into PowerPoint presentations.', category: 'pdf', href: '/pdf-to-pptx' },
    { id: 'ppt-to-pdf', title: 'PPT to PDF', description: 'Convert PowerPoint slides (.pptx) to PDF.', category: 'pdf', href: '/ppt-to-pdf' },
    { id: 'html-to-pdf', title: 'HTML to PDF', description: 'Convert web pages and HTML code to PDF.', category: 'pdf', href: '/html-to-pdf' },
    { id: 'pdf-to-html', title: 'PDF to HTML', description: 'Convert PDF documents into web pages.', category: 'pdf', href: '/pdf-to-html' },
    { id: 'pdf-to-text', title: 'PDF to Text', description: 'Extract clean plain text from PDF files.', category: 'pdf', href: '/pdf-to-text' },
    { id: 'text-to-pdf', title: 'Text to PDF', description: 'Convert plain text files (.txt) into PDF format.', category: 'pdf', href: '/text-to-pdf' },
    { id: 'csv-to-pdf', title: 'CSV to PDF', description: 'Transform CSV spreadsheet data into PDF tables.', category: 'pdf', href: '/csv-to-pdf' },
    { id: 'pdf-to-csv', title: 'PDF to CSV', description: 'Extract table data from PDF into CSV format.', category: 'pdf', href: '/pdf-to-csv' },
    { id: 'pdf-to-speech', title: 'PDF to Speech', description: 'Listen to PDF documents spoken out loud.', category: 'pdf', href: '/pdf-to-speech' },
    { id: 'speech-to-pdf', title: 'Speech to PDF', description: 'Dictate voice notes directly into a PDF document.', category: 'pdf', href: '/speech-to-pdf' },
    { id: 'pdf-to-image', title: 'PDF to Image', description: 'Convert PDF pages into JPG or PNG images.', category: 'pdf', href: '/pdf-to-image' },
    { id: 'pdf-watermark', title: 'PDF Watermark', description: 'Add text or logo watermarks to PDF files.', category: 'pdf', href: '/pdf-watermark' },
    { id: 'pdf-number', title: 'PDF Page Numberer', description: 'Add page numbers to header or footer of PDF.', category: 'pdf', href: '/pdf-number' },
    { id: 'pdf-extract-pages', title: 'Extract PDF Pages', description: 'Extract specific page numbers into new PDF.', category: 'pdf', href: '/pdf-extract-pages' },
    { id: 'pdf-delete-pages', title: 'Delete PDF Pages', description: 'Remove unwanted or blank pages from PDF.', category: 'pdf', href: '/pdf-delete-pages' },
    { id: 'pdf-grayscale', title: 'PDF to Grayscale', description: 'Convert colored PDFs to monochrome black & white.', category: 'pdf', href: '/pdf-grayscale' },
    { id: 'pdf-metadata', title: 'PDF Metadata Editor', description: 'Edit PDF title, author, subject, and keywords.', category: 'pdf', href: '/pdf-metadata' },
    { id: 'pdf-reorder', title: 'Reorder PDF Pages', description: 'Organize and reorder PDF pages visually.', category: 'pdf', href: '/pdf-reorder' },
    { id: 'editor', title: 'Advanced PDF Editor', description: 'Annotate, draw, edit text and mark up PDF pages.', category: 'pdf', href: '/editor', badge: 'Pro' },

    // Image Tools
    { id: 'image-resizer', title: 'Image Resizer', description: 'Resize JPG, PNG & WebP by pixels or ratio.', category: 'image', href: '/image-resizer', badge: 'Popular' },
    { id: 'image-cropper', title: 'Image Cropper', description: 'Crop images freehand or with preset aspect ratios.', category: 'image', href: '/image-cropper' },
    { id: 'image-converter', title: 'Image Converter', description: 'Convert between JPG, PNG, WebP, AVIF, HEIC.', category: 'image', href: '/image-converter', badge: 'Popular' },
    { id: 'convert-to-jpg', title: 'Convert to JPG', description: 'Convert PNG, WebP, AVIF, and GIF to JPG.', category: 'image', href: '/convert-to-jpg' },
    { id: 'convert-to-png', title: 'Convert to PNG', description: 'Convert JPG, WebP, and GIF to transparent PNG.', category: 'image', href: '/convert-to-png' },
    { id: 'png-to-webp', title: 'PNG to WebP', description: 'Convert PNG images to next-gen lightweight WebP.', category: 'image', href: '/png-to-webp' },
    { id: 'jpg-to-webp', title: 'JPG to WebP', description: 'Compress JPG images into WebP for faster web.', category: 'image', href: '/jpg-to-webp' },
    { id: 'svg-to-image', title: 'SVG to Image', description: 'Convert SVG vector files into high-res PNG/JPG.', category: 'image', href: '/svg-to-image' },
    { id: 'image-watermark', title: 'Image Watermark', description: 'Add text or logo watermarks to your pictures.', category: 'image', href: '/image-watermark' },
    { id: 'image-compressor', title: 'Image Compressor', description: 'Reduce image file size by up to 90% online.', category: 'image', href: '/image-compressor', badge: 'Popular' },
    { id: 'image-palette', title: 'Color Palette Generator', description: 'Extract HEX color palettes from photos.', category: 'image', href: '/image-palette' },
    { id: 'svg-optimizer', title: 'SVG Optimizer', description: 'Minify and clean up SVG vector files.', category: 'image', href: '/svg-optimizer' },
    { id: 'svg', title: 'SVG Editor & Viewer', description: 'Inspect, edit, and preview SVG code live.', category: 'image', href: '/svg' },
    { id: 'text-to-image', title: 'Text to Image Creator', description: 'Generate visual graphic quotes & text banners.', category: 'image', href: '/text-to-image' },

    // Developer & Data Tools
    { id: 'base64', title: 'Base64 Encoder & Decoder', description: 'Encode & decode strings, images, and files to Base64.', category: 'developer', href: '/base64', badge: 'Popular' },
    { id: 'jwt', title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens client-side.', category: 'developer', href: '/jwt', badge: 'Popular' },
    { id: 'json-formatter', title: 'JSON Formatter', description: 'Beautify, format, and minify JSON data.', category: 'developer', href: '/json-formatter', badge: 'Popular' },
    { id: 'json-validator', title: 'JSON Validator', description: 'Check JSON for syntax errors and validate schema.', category: 'developer', href: '/json-validator' },
    { id: 'json-diff', title: 'JSON Diff Checker', description: 'Compare two JSON objects side-by-side.', category: 'developer', href: '/json-diff' },
    { id: 'json-to-xml', title: 'JSON to XML', description: 'Convert JSON data into XML formatted strings.', category: 'developer', href: '/json-to-xml' },
    { id: 'yaml-json', title: 'YAML to JSON', description: 'Convert YAML configuration files to JSON format.', category: 'developer', href: '/yaml-json' },
    { id: 'csv-json', title: 'CSV to JSON', description: 'Convert CSV spreadsheets to JSON objects.', category: 'developer', href: '/csv-json' },
    { id: 'csv-to-excel', title: 'CSV to Excel', description: 'Convert raw CSV files into XLSX spreadsheets.', category: 'developer', href: '/csv-to-excel' },
    { id: 'excel-to-csv', title: 'Excel to CSV', description: 'Convert XLSX spreadsheets into raw CSV format.', category: 'developer', href: '/excel-to-csv' },
    { id: 'regex-tester', title: 'Regex Tester', description: 'Test and debug Regular Expressions in real-time.', category: 'developer', href: '/regex-tester' },
    { id: 'xml-tool', title: 'XML Formatter', description: 'Beautify, validate, and minify XML documents.', category: 'developer', href: '/xml-tool' },
    { id: 'sql-formatter', title: 'SQL Formatter', description: 'Beautify SQL queries for MySQL, Postgres, Oracle.', category: 'developer', href: '/sql-formatter', badge: 'Popular' },
    { id: 'sql-query-builder', title: 'SQL Query Builder', description: 'Build visual SQL SELECT queries without code.', category: 'developer', href: '/sql-query-builder' },
    { id: 'code-minifier', title: 'Code Minifier', description: 'Compress HTML, CSS, JavaScript, JSON, and TS.', category: 'developer', href: '/code-minifier' },
    { id: 'hash-generator', title: 'Hash & UUID Generator', description: 'Generate MD5, SHA-256, SHA-512, UUID v4.', category: 'developer', href: '/hash-generator' },
    { id: 'url-encoder', title: 'URL Encoder & Decoder', description: 'Encode or decode URI component strings.', category: 'developer', href: '/url-encoder' },
    { id: 'html-formatter', title: 'HTML Formatter', description: 'Format and beautify HTML markup code.', category: 'developer', href: '/html-formatter' },
    { id: 'css-formatter', title: 'CSS Formatter', description: 'Format and beautify CSS stylesheets.', category: 'developer', href: '/css-formatter' },
    { id: 'js-formatter', title: 'JS/TS Formatter', description: 'Beautify JavaScript and TypeScript code.', category: 'developer', href: '/js-formatter' },
    { id: 'case-converter', title: 'Case Converter', description: 'Switch between camelCase, snake_case, Title Case.', category: 'developer', href: '/case-converter' },
    { id: 'text-diff', title: 'Text Diff Checker', description: 'Compare text files side-by-side for changes.', category: 'developer', href: '/text-diff' },
    { id: 'text-to-word', title: 'Text to Word', description: 'Convert plain text files (.txt) into Word (.docx).', category: 'developer', href: '/text-to-word' },
    { id: 'word-to-text', title: 'Word to Text', description: 'Extract plain text from Word (.docx) files.', category: 'developer', href: '/word-to-text' },
    { id: 'html-to-word', title: 'HTML to Word', description: 'Convert HTML code into Microsoft Word documents.', category: 'developer', href: '/html-to-word' },

    // OCR Tools
    { id: 'ocr', title: 'Online OCR Tool', description: 'Extract text from scanned images and PDFs.', category: 'ocr', href: '/ocr', badge: 'Popular' },
    { id: 'image-to-text', title: 'Image to Text OCR', description: 'Convert photos and screenshots to editable text.', category: 'ocr', href: '/image-to-text' },
    { id: 'handwriting-ocr', title: 'Handwriting OCR', description: 'Recognize handwritten notes and convert to text.', category: 'ocr', href: '/handwriting-ocr' },
    { id: 'receipt-ocr', title: 'Receipt & Invoice OCR', description: 'Extract total amounts and date data from receipts.', category: 'ocr', href: '/receipt-ocr' },
    { id: 'pdf-ocr-text', title: 'PDF Text OCR', description: 'Make scanned PDF documents searchable & copyable.', category: 'ocr', href: '/pdf-ocr-text' },
    { id: 'multilingual-ocr', title: 'Multilingual OCR', description: 'OCR text recognition in 50+ world languages.', category: 'ocr', href: '/multilingual-ocr' },

    // AI & Creative Tools
    { id: 'resume-builder', title: 'AI Resume Builder', description: 'Create ATS-friendly resumes with AI assistance.', category: 'ai', href: '/resume-builder', badge: 'Popular' },
    { id: 'drowChart', title: 'AI Flowchart Maker', description: 'Build mind maps, flowcharts, and diagrams visually.', category: 'ai', href: '/drowChart' },
    { id: 'video-to-pdf', title: 'Video to PDF Notes', description: 'Extract video keyframes into PDF study notes.', category: 'ai', href: '/video-to-pdf' },
    { id: 'audio-to-transcript', title: 'Audio to Transcript', description: 'Transcribe MP3 audio recordings into text PDF.', category: 'ai', href: '/audio-to-transcript' },
    { id: 'reel-rig-studio', title: 'Reel Rig Studio', description: 'Create animated social media video shorts.', category: 'ai', href: '/reel-rig-studio' }
];

export default function AllToolsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredTools = ALL_TOOLS.filter((tool) => {
        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
        const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categoryIcons: Record<string, any> = {
        pdf: <FileText size={18} />,
        image: <Image size={18} />,
        developer: <Code size={18} />,
        ocr: <ScanText size={18} />,
        ai: <Sparkles size={18} />
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            <SEO
                toolId="tools"
                canonical="/tools"
                breadcrumbs={[
                    { name: 'Home', item: '/' },
                    { name: 'All Tools', item: '/tools' }
                ]}
            />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'All Tools', href: '/tools' }]} />

                <div className="text-center max-w-3xl mx-auto mb-10 animate-fadeIn">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
                        All Free Online Web Tools
                    </h1>
                    <p className="text-[var(--text-muted)] text-base md:text-lg">
                        Explore 75+ free online converters, PDF editors, developer utilities, image optimizers, OCR tools, and AI tools — 100% free with no registration.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search 75+ tools (e.g. merge pdf, json formatter, resize image)..."
                            className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border-strong)] rounded-full text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                        />
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === 'all'
                                ? 'bg-[var(--accent)] text-white shadow-md'
                                : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                        }`}
                    >
                        All Tools ({ALL_TOOLS.length})
                    </button>
                    {[
                        { id: 'pdf', label: 'PDF Tools' },
                        { id: 'image', label: 'Image Tools' },
                        { id: 'developer', label: 'Developer Tools' },
                        { id: 'ocr', label: 'OCR Tools' },
                        { id: 'ai', label: 'AI Tools' }
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat.id
                                    ? 'bg-[var(--accent)] text-white shadow-md'
                                    : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)]'
                            }`}
                        >
                            {categoryIcons[cat.id]}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid of Tools */}
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTools.map((tool) => (
                            <Link
                                key={tool.id}
                                href={tool.href}
                                className="group p-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                                            {categoryIcons[tool.category]}
                                        </div>
                                        {tool.badge && (
                                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[var(--accent)]/10 text-[var(--accent)]">
                                                {tool.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-1">
                                        {tool.title}
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-[var(--border)]/50 flex items-center text-xs font-medium text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                                    Open Tool <ArrowRight size={14} className="ml-1" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-[var(--text-muted)]">
                        <p className="text-lg font-semibold mb-2">No tools match your search query</p>
                        <p className="text-sm">Try searching for terms like &quot;pdf&quot;, &quot;json&quot;, &quot;image&quot;, or &quot;ocr&quot;.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
