import { FiShield, FiZap, FiGlobe, FiClock, FiUsers } from 'react-icons/fi';
import {
    LuFiles, LuScissors, LuPackage, LuPenLine, LuLock, LuLockOpen, LuRotateCcw, LuImage,
    LuFileText, LuFileOutput, LuTable, LuMonitor, LuCode, LuGlobe, LuFilePlus, LuFileDown,
    LuVolume2, LuMic, LuVideo, LuHeadphones, LuMaximize2, LuCrop, LuRefreshCw, LuPenTool,
    LuBriefcase, LuChartBar, LuKey, LuBraces, LuSquareCheck, LuArrowLeftRight,
    LuSearch, LuFileCode, LuDatabase, LuLayoutGrid, LuScanText, LuSparkles
} from 'react-icons/lu';

export const C = {
    pdf: { label: 'PDF Tools', color: '#FF5C7A', tint: 'rgba(255,92,122,.14)', grad: 'linear-gradient(135deg,#FF5C7A,#FF8A5C)', count: '15+ tools', desc: 'Merge, split, compress, convert, watermark and edit PDF files.', featured: 'Merge PDF' },
    image: { label: 'Image Tools', color: '#22C55E', tint: 'rgba(34,197,94,.14)', grad: 'linear-gradient(135deg,#22C55E,#12B8A0)', count: '14+ tools', desc: 'Resize, crop, compress, watermark and convert images fast.', featured: 'Resize Image' },
    docs: { label: 'Documents', color: '#3B82F6', tint: 'rgba(59,130,246,.14)', grad: 'linear-gradient(135deg,#3B82F6,#6366F1)', count: '19+ tools', desc: 'Convert Word, Excel, CSV, HTML and PowerPoint to/from PDF.', featured: 'Word to PDF' },
    ai: { label: 'AI Suite', color: '#8B5CF6', tint: 'rgba(139,92,246,.14)', grad: 'linear-gradient(135deg,#8B5CF6,#C026D3)', count: '2+ tools', desc: 'Build resumes, charts and diagrams with AI.', featured: 'AI Resume' },
    dev: { label: 'Developer', color: '#F59E0B', tint: 'rgba(245,158,11,.16)', grad: 'linear-gradient(135deg,#F59E0B,#EF4444)', count: '21+ tools', desc: 'Format JSON, XML, HTML, CSS, SQL, test regex and generate hashes.', featured: 'JSON Formatter' },
    ocr: { label: 'OCR', color: '#EC4899', tint: 'rgba(236,72,153,.14)', grad: 'linear-gradient(135deg,#EC4899,#8B5CF6)', count: '6+ tools', desc: 'Extract text from scans, handwriting, receipts, and PDFs.', featured: 'Precision OCR' },
};

export const allTools = [
    ['Merge PDF', 'pdf', 'Combine multiple PDFs into one polished document.', '/merge-pdf'],
    ['Split PDF', 'pdf', 'Separate pages from a PDF or save each page individually.', '/split-pdf'],
    ['Compress PDF', 'pdf', 'Shrink PDF file size without losing quality.', '/compress-pdf'],
    ['Advanced PDF Editor', 'pdf', 'Annotate, draw, and modify text on your PDF pages visually.', '/editor'],
    ['Protect PDF', 'pdf', 'Encrypt and secure your PDFs with a custom password.', '/protect-pdf'],
    ['Unlock PDF', 'pdf', 'Decrypt password protected PDFs and strip passwords.', '/pdf-unlock'],
    ['Rotate PDF', 'pdf', 'Rotate PDF pages clockwise or counter-clockwise.', '/rotate-pdf'],
    ['PDF to Image', 'pdf', 'Extract pages from your PDF as high-resolution images.', '/pdf-to-image'],
    ['PDF to Word', 'docs', 'Convert PDF documents to editable Microsoft Word files.', '/pdf-to-word'],
    ['Word to PDF', 'docs', 'Transform .docx files into standard PDF format.', '/word-to-pdf'],
    ['PDF to Excel', 'docs', 'Extract tabular data from PDFs to spreadsheets.', '/pdf-to-excel'],
    ['PowerPoint to PDF', 'docs', 'Convert presentation slides into PDF pages.', '/ppt-to-pdf'],
    ['HTML to PDF', 'docs', 'Convert web layouts and HTML pages to PDF format.', '/html-to-pdf'],
    ['PDF to HTML', 'docs', 'Export PDF documents into responsive HTML web pages.', '/pdf-to-html'],
    ['PDF to Text', 'docs', 'Extract raw plain text from PDF pages.', '/pdf-to-text'],
    ['Text to PDF', 'docs', 'Generate a formatted PDF document from raw text input.', '/text-to-pdf'],
    ['CSV to PDF', 'docs', 'Transform spreadsheet CSV files into organized PDF pages.', '/csv-to-pdf'],
    ['PDF to CSV', 'docs', 'Extract tables and rows from PDFs into CSV format.', '/pdf-to-csv'],
    ['PDF to Speech', 'docs', 'Convert document text into high-fidelity audible voiceovers.', '/pdf-to-speech'],
    ['Speech to PDF', 'docs', 'Convert your live voice into a polished PDF document instantly.', '/speech-to-pdf'],
    ['Video to PDF Notes', 'docs', 'Extract slide transitions from video files to study notes.', '/video-to-pdf'],
    ['Audio to Transcript', 'docs', 'Generate textual transcriptions from voice records.', '/audio-to-transcript'],
    ['Image Resizer', 'image', 'Scale and compress dimensions of PNG, JPG, and WebP images client-side.', '/image-resizer'],
    ['Image Cropper', 'image', 'Crop and adjust image regions with visual aspect ratio frames.', '/image-cropper'],
    ['Image Converter', 'image', 'Convert HEIC to JPG, WEBP to JPG, JPG to WEBP, PNG to WEBP, and more.', '/image-converter'],
    ['Image to SVG', 'image', 'Vectorise pixel images into fully scaleable SVG structures.', '/svg'],
    ['Convert to JPG', 'image', 'Convert uploaded files into standard JPEG image records.', '/convert-to-jpg'],
    ['Convert to PNG', 'image', 'Convert documents to lossless transparent portable network graphics.', '/convert-to-png'],
    ['AI Resume Builder', 'ai', 'Build a job-winning resume from scratch or by uploading your old one.', '/resume-builder'],
    ['Pro AI Chart & Diagram Maker', 'ai', 'Create flowcharts, DFDs, BPMN, Swimlanes, and logic maps with expert AI.', '/drowChart'],
    ['Base64 Encoder/Decoder', 'dev', 'Convert plain text and files to Base64 data strings or decode back.', '/base64'],
    ['JWT Decoder', 'dev', 'Inspect and decode JSON Web Tokens (JWT) client-side in real-time.', '/jwt'],
    ['JSON Formatter', 'dev', 'Pretty print and beautify raw JSON, or minify JSON payloads.', '/json-formatter'],
    ['JSON Validator', 'dev', 'Check structural syntax validation of JSON documents with line highlights.', '/json-validator'],
    ['JSON Diff Checker', 'dev', 'Compare baseline and modified JSON structures with color highlights.', '/json-diff'],
    ['YAML ↔ JSON Converter', 'dev', 'Convert YAML text files to JSON strings and JSON arrays to YAML format.', '/yaml-json'],
    ['CSV ↔ JSON Converter', 'dev', 'Transform CSV tabular sheets to JSON array of objects and vice versa.', '/csv-json'],
    ['Regex Tester', 'dev', 'Test regular expressions in real-time with visual match highlighting.', '/regex-tester'],
    ['XML Formatter & Validator', 'dev', 'Beautify XML nesting nodes and parse syntax validation errors instantly.', '/xml-tool'],
    ['SQL Formatter', 'dev', 'Pretty print SQL scripts and capitalize database query statements.', '/sql-formatter'],
    ['Visual SQL Query Builder', 'dev', 'Create SQL queries visually for SELECT, INSERT, UPDATE, and DELETE tasks.', '/sql-query-builder'],
    ['Markdown Editor & HTML Converter', 'dev', 'Write rich Markdown and compile it into styled visual HTML codes instantly.', '/markdown-editor'],
    ['Unified Code Minifier', 'dev', 'Compress HTML codes, CSS stylesheets, and Javascript files client-side.', '/code-minifier'],
    ['Precision OCR', 'ocr', 'Extract text from scans in 100+ languages.', '/ocr'],

    ['PDF Watermark', 'pdf', 'Add custom text watermarks with opacity and rotation to PDF pages.', '/pdf-watermark'],
    ['PDF Page Numberer', 'pdf', 'Automatically insert formatted page numbers into PDF files.', '/pdf-number'],
    ['SVG to Image', 'image', 'Convert vector SVG files into high-res PNG, JPG, or WebP images.', '/svg-to-image'],
    ['Image Watermark', 'image', 'Stamp text overlays and branding onto uploaded images.', '/image-watermark'],
    ['UUID & Hash Generator', 'dev', 'Generate MD5, SHA-256, SHA-512 hashes, and UUID v4 identifiers.', '/hash-generator'],
    ['URL Encoder & Parser', 'dev', 'Encode, decode URI strings, and inspect URL query parameters.', '/url-encoder'],
    ['JSON to XML Converter', 'dev', 'Transform JSON object payloads into clean XML document markup.', '/json-to-xml'],

    // PDF Tools (+5)
    ['PDF Page Extractor', 'pdf', 'Extract specific pages or page ranges into a standalone PDF document.', '/pdf-extract-pages'],
    ['PDF Page Delete', 'pdf', 'Remove unwanted pages or page ranges from your PDF document.', '/pdf-delete-pages'],
    ['PDF Grayscale Converter', 'pdf', 'Convert color PDF documents into black & white grayscale for print.', '/pdf-grayscale'],
    ['PDF Metadata Editor', 'pdf', 'Edit PDF metadata tags like Title, Author, Subject, and Keywords.', '/pdf-metadata'],
    ['PDF Page Reorder', 'pdf', 'Rearrange and re-index PDF page sequences visually.', '/pdf-reorder'],

    // Image Tools (+5)
    ['Image Compressor', 'image', 'Shrink PNG, JPG, and WebP image sizes with customizable quality.', '/image-compressor'],
    ['PNG to WEBP Converter', 'image', 'Convert transparent PNG images into lightweight WebP format.', '/png-to-webp'],
    ['JPG to WEBP Converter', 'image', 'Convert JPEG photos into modern optimized WebP format.', '/jpg-to-webp'],
    ['Image Color Palette Extractor', 'image', 'Extract primary color palettes and hex codes from uploaded images.', '/image-palette'],
    ['SVG Optimizer', 'image', 'Minify raw SVG markup and strip metadata comments.', '/svg-optimizer'],
    ['Text to Image Generator', 'image', 'Generate high-resolution PNG, JPG, or WebP images from custom styled text.', '/text-to-image'],


    // Documents (+5)
    ['Word to Text Converter', 'docs', 'Extract clean unformatted plain text from Word .docx documents.', '/word-to-text'],
    ['Excel to CSV Converter', 'docs', 'Convert multi-sheet Excel workbooks (.xlsx) into CSV tabular format.', '/excel-to-csv'],
    ['CSV to Excel Converter', 'docs', 'Convert tabular CSV data files into formatted Excel spreadsheets.', '/csv-to-excel'],
    ['Text to Word Converter', 'docs', 'Create formatted Microsoft Word .docx files from plain text notes.', '/text-to-word'],
    ['HTML to Word Converter', 'docs', 'Convert HTML markup pages into editable Microsoft Word documents.', '/html-to-word'],

    // Developer Tools (+5)
    ['HTML Formatter & Sanitizer', 'dev', 'Pretty-print, format, and sanitize unindented HTML markup code.', '/html-formatter'],
    ['CSS Formatter & Beautifier', 'dev', 'Beautify, format, and indent stylesheet CSS code.', '/css-formatter'],
    ['JS/TS Formatter', 'dev', 'Format and clean up JavaScript and TypeScript code snippets.', '/js-formatter'],
    ['String Case Converter', 'dev', 'Convert text between camelCase, PascalCase, snake_case, and UPPERCASE.', '/case-converter'],
    ['Text Difference Checker', 'dev', 'Compare two text documents side-by-side with line diff highlights.', '/text-diff'],

    // OCR Tools (+5)
    ['Image to Text OCR', 'ocr', 'Extract editable text from scanned documents and photos.', '/image-to-text'],
    ['Handwriting OCR Scanner', 'ocr', 'Recognize and convert handwritten notes into digital text.', '/handwriting-ocr'],
    ['Receipt & Invoice OCR', 'ocr', 'Extract totals, dates, and line items from receipts and invoices.', '/receipt-ocr'],
    ['PDF Text OCR Scanner', 'ocr', 'Extract text from scanned non-searchable PDF files using OCR.', '/pdf-ocr-text'],
    ['Multi-Language OCR Engine', 'ocr', 'Recognize text across 100+ global languages using advanced OCR.', '/multilingual-ocr'],
];

export const toolIcons: Record<string, any> = {
    'Merge PDF': LuFiles,
    'Split PDF': LuScissors,
    'Compress PDF': LuPackage,
    'Advanced PDF Editor': LuPenLine,
    'Protect PDF': LuLock,
    'Unlock PDF': LuLockOpen,
    'Rotate PDF': LuRotateCcw,
    'PDF to Image': LuImage,
    'PDF to Word': LuFileText,
    'Word to PDF': LuFileOutput,
    'PDF to Excel': LuTable,
    'PowerPoint to PDF': LuMonitor,
    'HTML to PDF': LuCode,
    'PDF to HTML': LuGlobe,
    'PDF to Text': LuFileDown,
    'Text to PDF': LuFilePlus,
    'CSV to PDF': LuTable,
    'PDF to CSV': LuFileDown,
    'PDF to Speech': LuVolume2,
    'Speech to PDF': LuMic,
    'Video to PDF Notes': LuVideo,
    'Audio to Transcript': LuHeadphones,
    'Image Resizer': LuMaximize2,
    'Image Cropper': LuCrop,
    'Image Converter': LuRefreshCw,
    'Image to SVG': LuPenTool,
    'Convert to JPG': LuImage,
    'Convert to PNG': LuImage,
    'AI Resume Builder': LuBriefcase,
    'Pro AI Chart & Diagram Maker': LuChartBar,
    'Base64 Encoder/Decoder': LuCode,
    'JWT Decoder': LuKey,
    'JSON Formatter': LuBraces,
    'JSON Validator': LuSquareCheck,
    'JSON Diff Checker': LuArrowLeftRight,
    'YAML ↔ JSON Converter': LuArrowLeftRight,
    'CSV ↔ JSON Converter': LuTable,
    'Regex Tester': LuSearch,
    'XML Formatter & Validator': LuFileCode,
    'SQL Formatter': LuDatabase,
    'Visual SQL Query Builder': LuLayoutGrid,
    'Markdown Editor & HTML Converter': LuFileText,
    'Unified Code Minifier': LuCode,
    'Precision OCR': LuScanText,
    'PDF Watermark': LuPenLine,
    'PDF Page Numberer': LuFilePlus,
    'SVG to Image': LuImage,
    'Image Watermark': LuPenTool,
    'UUID & Hash Generator': LuKey,
    'URL Encoder & Parser': LuGlobe,
    'JSON to XML Converter': LuFileCode,

    // PDF Tools (+5)
    'PDF Page Extractor': LuScissors,
    'PDF Page Delete': LuFiles,
    'PDF Grayscale Converter': LuFileText,
    'PDF Metadata Editor': LuPenLine,
    'PDF Page Reorder': LuRotateCcw,

    // Image Tools (+5)
    'Image Compressor': LuMaximize2,
    'PNG to WEBP Converter': LuImage,
    'JPG to WEBP Converter': LuImage,
    'Image Color Palette Extractor': LuPenTool,
    'SVG Optimizer': LuCode,
    'Text to Image Generator': LuImage,


    // Documents (+5)
    'Word to Text Converter': LuFileText,
    'Excel to CSV Converter': LuTable,
    'CSV to Excel Converter': LuTable,
    'Text to Word Converter': LuFileOutput,
    'HTML to Word Converter': LuFileCode,

    // Developer Tools (+5)
    'HTML Formatter & Sanitizer': LuFileCode,
    'CSS Formatter & Beautifier': LuCode,
    'JS/TS Formatter': LuCode,
    'String Case Converter': LuBraces,
    'Text Difference Checker': LuArrowLeftRight,

    // OCR Tools (+5)
    'Image to Text OCR': LuScanText,
    'Handwriting OCR Scanner': LuScanText,
    'Receipt & Invoice OCR': LuTable,
    'PDF Text OCR Scanner': LuFileText,
    'Multi-Language OCR Engine': LuGlobe,
};



export const catIcons: Record<keyof typeof C, any> = {
    pdf: LuFileText,
    image: LuImage,
    docs: LuFileOutput,
    ai: LuSparkles,
    dev: LuCode,
    ocr: LuScanText,
};

export const benefits = [
    { icon: FiShield, title: 'Enterprise Security', description: 'Military-grade encryption for all file transfers. Files are auto-deleted from our servers within 24 hours.' },
    { icon: FiZap, title: 'AI Optimizers', description: 'Our AI engines optimize PDF file sizes without losing quality, making your documents web-ready instantly.' },
    { icon: FiGlobe, title: 'Global Reach', description: 'Supporting 100+ languages for OCR and document conversion, ensuring accuracy across all borders.' },
    { icon: FiClock, title: 'Always Online', description: 'Distributed cloud infrastructure ensures 99.9% availability. Your tools are ready when you are.' },
    { icon: FiUsers, title: 'No Compromise', description: 'Highest quality output in the industry — whether SVG vectors or OCR text, we deliver precision.' },
    { icon: FiShield, title: 'Intuitive Interface', description: 'A clean, modern interface designed for focus. Custom views to match your workflow preferences.' },
];

export const freeFeatures = [
    'Unlimited Conversions',
    'High Precision OCR',
    'AI Diagram Generator',
    '24h File Retention',
    'No Account Required',
    'All 75+ Tools Included',
];
