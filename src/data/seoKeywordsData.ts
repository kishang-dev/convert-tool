export interface ToolSEOMetadata {
    title: string;
    description: string;
    keywords: string[];
    softwareCategory?: string;
    steps?: { name: string; text: string }[];
    features?: { title: string; description: string; icon?: string }[];
    faqs?: { question: string; answer: string }[];
}

export const MASTER_SEO_DATA: Record<string, ToolSEOMetadata> = {
    // --- Core & Static Pages ---
    "home": {
        title: "ToolBasketAI — 75+ Free Online PDF, Image, Developer & AI Tools",
        description: "Convert, merge, split, compress PDFs, resize images, format JSON/SQL client-side, extract OCR text, and build AI resumes online for free. 100% private, no signup, no watermark.",
        keywords: [
            "free online pdf tools", "merge pdf free", "compress pdf online", "pdf to word converter",
            "word to pdf online", "image resizer online by pixel", "compress png jpg webp",
            "json formatter online client side", "ai resume builder free", "extract text from image ocr",
            "no watermark free tools", "online document converter", "ToolBasketAI"
        ],
        faqs: [
            { question: "What is ToolBasketAI?", answer: "ToolBasketAI is an all-in-one free online suite of 75+ document, PDF, image, developer, and AI tools." },
            { question: "Are all tools 100% free to use?", answer: "Yes, all tools are completely free with no usage limits, watermark, or hidden subscription fees." },
            { question: "Is my uploaded data safe and private?", answer: "All file processing is encrypted. Files uploaded to servers are automatically deleted within 24 hours, and text/developer tools run 100% client-side in your browser." }
        ]
    },
    "tools": {
        title: "All Free Online Tools Directory — PDF, Image, Developer & AI Tools",
        description: "Browse 75+ free online web tools. Convert PDFs, edit images, format JSON & SQL, run OCR text recognition, generate hashes, and build resumes with zero signup.",
        keywords: [
            "all free online tools", "online web tools list", "free pdf converters online",
            "developer tools online", "image editing tools online", "ocr text recognition tools",
            "free pdf software web", "ToolBasketAI directory"
        ]
    },
    "about": {
        title: "About ToolBasketAI — Free, Fast & Private Web Tools Platform",
        description: "Learn about ToolBasketAI's mission to provide fast, privacy-focused, browser-based online tools for PDF editing, image conversion, developer utilities, and AI document processing.",
        keywords: [
            "about toolbasketai", "free web tools mission", "privacy focused online converters",
            "browser based pdf tools", "secure document processing online"
        ]
    },
    "contact": {
        title: "Contact ToolBasketAI — Support & Feature Requests",
        description: "Get in touch with the ToolBasketAI team. Report bugs, request new tools, ask questions about document conversions, or submit feedback.",
        keywords: [
            "contact toolbasketai", "web tools support", "report converter bug", "request new tool online"
        ]
    },
    "privacy": {
        title: "Privacy Policy — ToolBasketAI Data Security & Privacy Guarantee",
        description: "Read the ToolBasketAI Privacy Policy. Learn how we protect your uploaded documents, guarantee end-to-end encryption, and delete files automatically within 24 hours.",
        keywords: [
            "toolbasketai privacy policy", "document privacy online", "secure file converter policy",
            "automatic file deletion converter"
        ]
    },
    "terms": {
        title: "Terms of Service — ToolBasketAI Usage Guidelines & Rules",
        description: "ToolBasketAI Terms of Service. Guidelines and terms governing the free use of our online PDF, image, developer, and AI tools.",
        keywords: [
            "toolbasketai terms of service", "online tool terms of use", "free converter usage policy"
        ]
    },
    "blog": {
        title: "ToolBasketAI Blog — PDF Guides, Developer Tutorials & Image Tips",
        description: "Explore tutorials, how-to guides, and expert advice on PDF editing, image compression, developer workflows, OCR text extraction, and productivity tips.",
        keywords: [
            "pdf editing tips", "how to compress images without quality loss", "json formatting tutorials",
            "ocr text extraction guide", "productivity web tools blog"
        ]
    },

    // --- PDF Tools ---
    "merge-pdf": {
        title: "Merge PDF Online Free — Combine PDF Files & Rearrange Pages",
        description: "Combine multiple PDF files into one document for free. Drag & drop reorder, preview individual pages, and merge unlimited PDFs with 100% privacy and no watermark.",
        keywords: [
            "merge pdf free", "combine pdf files online", "pdf joiner online without watermark",
            "free pdf merger online", "reorder pdf pages", "merge multiple pdfs", "combine pdf documents",
            "pdf binder free"
        ],
        steps: [
            { name: "Upload PDFs", text: "Select and upload two or more PDF documents from your device." },
            { name: "Reorder Pages", text: "Drag and drop thumbnails to reorder PDF pages exactly as desired." },
            { name: "Merge & Download", text: "Click Merge PDF to join your files into a single document instantly." }
        ],
        faqs: [
            { question: "Can I merge password-protected PDFs?", answer: "Unlock protected PDFs first using our PDF Unlock tool before merging." },
            { question: "Is there a limit on how many PDFs I can merge?", answer: "You can combine up to 50 PDF files simultaneously completely free." }
        ]
    },
    "split-pdf": {
        title: "Split PDF Online Free — Extract Pages or Separate PDF Files",
        description: "Split PDF pages or extract custom page ranges instantly online. Separate PDF documents into individual files with high quality and no watermark.",
        keywords: [
            "split pdf online free", "extract pdf pages", "separate pdf files", "pdf splitter free",
            "divide pdf pages", "cut pdf pages online", "save specific pdf pages"
        ],
        steps: [
            { name: "Upload PDF", text: "Choose the PDF file you wish to split or extract pages from." },
            { name: "Select Range", text: "Enter page ranges or select individual pages to extract." },
            { name: "Split & Save", text: "Click Split PDF to download your separated PDF files." }
        ],
        faqs: [
            { question: "How do I extract specific page numbers?", answer: "Enter ranges like 1-5, 8, 11-15 in the page selection box." }
        ]
    },
    "compress-pdf": {
        title: "Compress PDF Online Free — Reduce PDF File Size Without Quality Loss",
        description: "Compress large PDF files online for free. Batch compress up to 50 PDFs, shrink file size for email attachments, and preserve document resolution.",
        keywords: [
            "compress pdf free", "reduce pdf file size online", "shrink pdf size for email",
            "compress pdf without losing quality", "batch compress pdf", "pdf optimizer online"
        ],
        steps: [
            { name: "Upload PDF", text: "Upload the PDF files you need to shrink." },
            { name: "Choose Compression", text: "Select your preferred compression level (Extreme, Recommended, High Quality)." },
            { name: "Download Compressed PDF", text: "Download your reduced PDF file immediately." }
        ]
    },
    "protect-pdf": {
        title: "Protect PDF Online Free — Add Password & Encrypt PDF Documents",
        description: "Protect PDF documents online for free. Add strong AES 256-bit password encryption to lock your PDFs against unauthorized viewing or printing.",
        keywords: [
            "protect pdf online free", "add password to pdf", "encrypt pdf file",
            "lock pdf with password", "secure pdf document", "pdf password protection"
        ]
    },
    "pdf-unlock": {
        title: "Unlock PDF Online Free — Remove Password Protection from PDF",
        description: "Remove PDF passwords online instantly for free. Unlock password-protected PDF files to edit, view, copy, or print without restriction.",
        keywords: [
            "unlock pdf free online", "remove password from pdf", "pdf password remover",
            "unlock restricted pdf", "decrypt pdf file online"
        ]
    },
    "rotate-pdf": {
        title: "Rotate PDF Pages Online Free — Rotate PDF 90, 180 or 270 Degrees",
        description: "Rotate PDF pages clockwise or counter-clockwise online. Fix upside-down scanned PDFs, rotate individual pages or entire PDF files for free.",
        keywords: [
            "rotate pdf online free", "rotate pdf pages 90 degrees", "fix upside down pdf",
            "rotate single page in pdf", "save rotated pdf"
        ]
    },
    "pdf-to-word": {
        title: "PDF to Word Converter Online Free — Convert PDF to Editable DOCX",
        description: "Convert PDF documents into editable Microsoft Word (.docx) files seamlessly. Batch process up to 50 PDFs with 100% formatting & font preservation.",
        keywords: [
            "pdf to word converter", "convert pdf to docx free", "pdf to editable word",
            "free online pdf to word", "batch pdf to word converter", "extract word from pdf"
        ]
    },
    "word-to-pdf": {
        title: "Word to PDF Converter Online Free — Convert DOCX to PDF",
        description: "Convert Microsoft Word (.doc, .docx) documents into clean PDF files online for free. Maintains layout, formatting, tables, and images perfectly.",
        keywords: [
            "word to pdf converter free", "convert docx to pdf online", "doc to pdf free",
            "convert word document to pdf", "save docx as pdf"
        ]
    },
    "pdf-to-excel": {
        title: "PDF to Excel Converter Online Free — Extract Tables to XLSX",
        description: "Convert PDF files into editable Microsoft Excel spreadsheets (.xlsx, .csv). Extract tabular financial data and reports accurately without losing structure.",
        keywords: [
            "pdf to excel converter free", "convert pdf to xlsx online", "extract pdf tables to excel",
            "pdf to spreadsheet converter", "convert scan pdf to excel"
        ]
    },
    "excel-to-pdf": {
        title: "Excel to PDF Converter Online Free — Convert XLSX to PDF",
        description: "Convert Excel spreadsheets (.xlsx, .xls, .csv) into formatted PDF documents online for free. Fits table columns cleanly onto PDF pages.",
        keywords: [
            "excel to pdf converter free", "convert xlsx to pdf online", "spreadsheet to pdf",
            "save excel sheet as pdf"
        ]
    },
    "pdf-to-pptx": {
        title: "PDF to PPTX Converter Online Free — Convert PDF to PowerPoint",
        description: "Convert PDF slides into editable Microsoft PowerPoint presentations (.pptx) online for free. Preserves layout, visuals, and text frames.",
        keywords: [
            "pdf to pptx converter free", "convert pdf to powerpoint", "pdf to slides converter",
            "edit pdf presentation in ppt"
        ]
    },
    "ppt-to-pdf": {
        title: "PowerPoint to PDF Converter Online Free — Convert PPTX to PDF",
        description: "Convert PowerPoint presentations (.ppt, .pptx) to clean PDF documents online for free. Perfect for distribution and printing.",
        keywords: [
            "ppt to pdf converter free", "convert powerpoint to pdf online", "pptx to pdf free",
            "save presentation as pdf"
        ]
    },
    "html-to-pdf": {
        title: "HTML to PDF Converter Online Free — Save Web Pages as PDF",
        description: "Convert HTML files or Web page code into styled PDF documents online for free. Retains CSS styling, images, links, and typography.",
        keywords: [
            "html to pdf converter free", "convert web page to pdf", "html string to pdf",
            "save HTML code as PDF"
        ]
    },
    "pdf-to-html": {
        title: "PDF to HTML Converter Online Free — Convert PDF to Web Page",
        description: "Convert PDF documents into responsive HTML5 web pages with embedded fonts and images. Great for publishing PDF documents on websites.",
        keywords: [
            "pdf to html converter free", "convert pdf to web page", "pdf to responsive html",
            "publish pdf as webpage"
        ]
    },
    "pdf-to-text": {
        title: "PDF to Text Converter Online Free — Extract Plain Text from PDF",
        description: "Extract clean plain text (.txt) from PDF documents online for free. Fast text extraction for analysis, summaries, and copy-pasting.",
        keywords: [
            "pdf to text converter free", "extract text from pdf online", "pdf to txt converter",
            "read text inside pdf"
        ]
    },
    "text-to-pdf": {
        title: "Text to PDF Converter Online Free — Convert TXT to PDF Document",
        description: "Convert plain text (.txt) files or written notes into formatted PDF documents online for free. Custom line spacing, margins, and fonts.",
        keywords: [
            "text to pdf converter free", "convert txt to pdf online", "create pdf from text",
            "plain text to formatted pdf"
        ]
    },
    "csv-to-pdf": {
        title: "CSV to PDF Converter Online Free — Convert CSV Data to PDF Table",
        description: "Convert CSV spreadsheet files into clean, organized PDF tables online for free. Formats data rows into printable PDF reports.",
        keywords: [
            "csv to pdf converter free", "convert csv to pdf online", "csv table to pdf report",
            "export csv as pdf table"
        ]
    },
    "pdf-to-csv": {
        title: "PDF to CSV Converter Online Free — Extract Tables from PDF to CSV",
        description: "Extract table rows and tabular data from PDF files into raw CSV format online for free. Ideal for data entry, analysis, and database imports.",
        keywords: [
            "pdf to csv converter free", "extract pdf tables to csv", "convert pdf to raw data csv",
            "pdf table scraper online"
        ]
    },
    "pdf-to-speech": {
        title: "PDF to Speech Online Free — Convert PDF Text to Audio Voiceover",
        description: "Listen to PDF documents online for free. Convert PDF text into natural-sounding speech audio voiceover (MP3). Ideal for proofreading and accessibility.",
        keywords: [
            "pdf to speech free", "read pdf out loud online", "pdf text to audio mp3",
            "pdf voice generator", "listen to pdf document"
        ]
    },
    "speech-to-pdf": {
        title: "Speech to PDF Converter Online Free — Dictate Voice to PDF Document",
        description: "Dictate text using your microphone and generate a PDF document online for free. Real-time speech recognition for hands-free PDF notes creation.",
        keywords: [
            "speech to pdf converter free", "dictate voice to pdf", "voice notes to pdf online",
            "microphone to pdf document"
        ]
    },
    "pdf-to-image": {
        title: "PDF to Image Converter Online Free — Convert PDF Pages to JPG/PNG",
        description: "Convert PDF pages into high-resolution JPG or PNG images online for free. Extract individual pages or convert entire PDF files into clear images.",
        keywords: [
            "pdf to image converter free", "convert pdf to jpg online", "pdf to png free",
            "extract pages as image", "high quality pdf to image"
        ]
    },
    "pdf-watermark": {
        title: "PDF Watermark Tool Online Free — Add Text or Image Watermark to PDF",
        description: "Add custom text or logo image watermarks to your PDF documents online for free. Set opacity, position, rotation, and font colors to protect documents.",
        keywords: [
            "add watermark to pdf free", "pdf watermark tool online", "text watermark pdf",
            "image logo watermark on pdf", "protect pdf with watermark"
        ]
    },
    "pdf-number": {
        title: "PDF Page Numberer Online Free — Add Page Numbers to PDF",
        description: "Add page numbers to your PDF documents online for free. Customize position, page number format, header/footer margins, font size, and style.",
        keywords: [
            "add page numbers to pdf free", "pdf page numberer online", "insert page numbers in pdf",
            "number pdf pages"
        ]
    },
    "pdf-extract-pages": {
        title: "PDF Page Extractor Online Free — Extract Specific PDF Pages",
        description: "Select and extract specific pages from a PDF document online for free. Save extracted pages as a new standalone PDF file with 1-click.",
        keywords: [
            "extract pdf pages free", "save specific pdf pages", "pdf page extractor online",
            "pull pages from pdf"
        ]
    },
    "pdf-delete-pages": {
        title: "Delete PDF Pages Online Free — Remove Unwanted Pages from PDF",
        description: "Delete unwanted or blank pages from your PDF file online for free. Select thumbnails and remove pages instantly before saving.",
        keywords: [
            "delete pages from pdf free", "remove pdf pages online", "delete unwanted pdf page",
            "remove blank page from pdf"
        ]
    },
    "pdf-grayscale": {
        title: "PDF to Grayscale Converter Online Free — Convert PDF to Black & White",
        description: "Convert colored PDF files to monochrome grayscale (Black & White) online for free. Reduce printer ink usage and shrink file sizes.",
        keywords: [
            "pdf to grayscale free", "convert colored pdf to black and white", "monochrome pdf converter",
            "save printer ink pdf"
        ]
    },
    "pdf-metadata": {
        title: "PDF Metadata Editor Online Free — Edit PDF Title, Author & Keywords",
        description: "Edit PDF document properties and metadata online for free. Modify PDF title, author, subject, creator, and SEO keywords easily.",
        keywords: [
            "pdf metadata editor free", "edit pdf properties online", "change pdf author and title",
            "modify pdf tags and keywords"
        ]
    },
    "pdf-reorder": {
        title: "Reorder PDF Pages Online Free — Drag & Drop PDF Page Organizer",
        description: "Reorder pages inside any PDF document online for free. Visual drag & drop page organizer with preview thumbnails for every page.",
        keywords: [
            "reorder pdf pages free", "rearrange pages in pdf online", "pdf page organizer drag drop",
            "change pdf page order"
        ]
    },
    "editor": {
        title: "Advanced PDF Editor Online Free — Draw, Annotate & Edit PDF Pages",
        description: "Edit PDF files online for free. Annotate text, draw, insert shapes, highlight content, rotate pages, and save modified PDFs instantly in your browser.",
        keywords: [
            "free online pdf editor", "edit pdf online without software", "annotate pdf online",
            "draw on pdf free", "pdf writer and markup tool"
        ]
    },
    "video-to-pdf": {
        title: "Video to PDF Converter Online Free — Extract Video Slides to Study Notes",
        description: "Convert video presentations, webinars, or lectures into PDF slide notes online for free. Extract key scene frames into a structured PDF document.",
        keywords: [
            "video to pdf converter free", "extract slides from video", "lecture video to pdf notes",
            "mp4 to pdf notes online"
        ]
    },
    "audio-to-transcript": {
        title: "Audio to Transcript Online Free — Convert Speech Audio to Text PDF",
        description: "Transcribe audio recordings (MP3, WAV, M4A) into accurate text transcripts and PDF documents online for free. Fast speech-to-text converter.",
        keywords: [
            "audio to transcript free", "convert mp3 to text pdf", "speech to text transcriber",
            "audio recording to text document"
        ]
    },

    // --- Image Tools ---
    "image-resizer": {
        title: "Image Resizer Online Free — Resize JPG, PNG & WebP by Pixel or Ratio",
        description: "Resize images online by exact pixel dimensions or aspect ratio for free. Compress image file size without losing quality. Works for JPG, PNG, WebP & GIF.",
        keywords: [
            "image resizer online free", "resize image by pixel", "resize png jpg webp",
            "change image dimensions free", "photo resizer online"
        ]
    },
    "image-cropper": {
        title: "Image Cropper Online Free — Crop Photos & Images Online",
        description: "Crop photos and images online for free. Use preset aspect ratios (1:1, 16:9, 4:3) or freehand crop. Export as high-quality JPG, PNG, or WebP.",
        keywords: [
            "image cropper free online", "crop photos online", "square image cropper",
            "crop image circle", "photo crop tool"
        ]
    },
    "image-converter": {
        title: "Image Converter Online Free — Convert JPG, PNG, WebP, AVIF, HEIC",
        description: "Convert image formats online for free. Convert JPG, PNG, WebP, AVIF, BMP, GIF, and HEIC with batch processing and transparent background support.",
        keywords: [
            "image converter online free", "convert image format", "batch image converter",
            "heic to jpg free", "avif to png online"
        ]
    },
    "convert-to-jpg": {
        title: "Convert to JPG Online Free — Convert PNG, WebP, AVIF, GIF to JPG",
        description: "Convert PNG, WebP, BMP, AVIF, and GIF to standard JPG format online for free. Batch convert with custom background color fill for transparent images.",
        keywords: [
            "convert to jpg free", "png to jpg converter", "webp to jpg online",
            "heic to jpg online free", "batch convert to jpg"
        ]
    },
    "convert-to-png": {
        title: "Convert to PNG Online Free — Convert JPG, WebP to Lossless PNG",
        description: "Convert JPG, WebP, BMP, and GIF to lossless transparent PNG format online for free. Preserves alpha channel transparency with high clarity.",
        keywords: [
            "convert to png free", "jpg to png converter", "webp to png online",
            "transparent png converter", "lossless image converter"
        ]
    },
    "png-to-webp": {
        title: "PNG to WebP Converter Online Free — Compress PNG to Next-Gen WebP",
        description: "Convert PNG images to lightweight WebP format online for free. Reduce website image file size by up to 80% while retaining full transparency.",
        keywords: [
            "png to webp converter free", "convert png to webp", "next gen image format webp",
            "shrink png size webp", "website image optimizer"
        ]
    },
    "jpg-to-webp": {
        title: "JPG to WebP Converter Online Free — Convert JPEG to WebP Online",
        description: "Convert JPG/JPEG images to next-gen WebP format online for free. Speed up page load times with smaller image file sizes.",
        keywords: [
            "jpg to webp converter free", "convert jpeg to webp online", "shrink jpg image size",
            "web image optimization"
        ]
    },
    "svg-to-image": {
        title: "SVG to Image Converter Online Free — Convert SVG Vector to PNG/JPG",
        description: "Convert SVG vector files into high-resolution raster PNG, JPG, or WebP images online for free. Set custom rendering scale and dimensions.",
        keywords: [
            "svg to image converter free", "convert svg to png high resolution", "svg to jpg online",
            "rasterize svg vector"
        ]
    },
    "image-watermark": {
        title: "Image Watermark Tool Online Free — Add Watermark to Photos",
        description: "Add custom text or image logo watermarks to your photos and images online for free. Protect copyright with customizable opacity and position.",
        keywords: [
            "add watermark to image free", "watermark photos online", "photo copyright protector",
            "logo watermark on picture"
        ]
    },
    "image-compressor": {
        title: "Image Compressor Online Free — Compress JPG, PNG, WebP Images",
        description: "Compress images online without losing visual quality. Reduce file sizes of JPG, PNG, and WebP images by up to 90% for faster websites.",
        keywords: [
            "image compressor free", "compress photo size online", "reduce image kb size",
            "png compressor without quality loss", "jpg size reducer"
        ]
    },
    "image-palette": {
        title: "Image Color Palette Generator Online Free — Extract Hex Colors",
        description: "Extract color palettes from any photo or image online for free. Get exact HEX, RGB, and HSL color codes for graphic design and web development.",
        keywords: [
            "image color palette generator", "extract color from image", "photo hex color picker",
            "image color scheme finder", "palette generator from image"
        ]
    },
    "svg-optimizer": {
        title: "SVG Optimizer & Cleaner Online Free — Minify SVG Vector Files",
        description: "Optimize and minify SVG vector graphics online for free. Remove clean code bloat, useless metadata, and reduce SVG file size instantly.",
        keywords: [
            "svg optimizer online free", "minify svg code", "clean svg file",
            "shrink svg file size", "svg code viewer"
        ]
    },
    "svg": {
        title: "Online SVG Editor & Viewer Free — Edit Vector Code Live",
        description: "View, edit, preview, and sanitize SVG files live in your browser for free. Inspect vector code, adjust paths, and export optimized SVGs.",
        keywords: [
            "svg editor online free", "live svg viewer", "vector code editor",
            "preview svg code", "svg viewer online"
        ]
    },
    "text-to-image": {
        title: "Text to Image Generator Online Free — AI Banner & Graphic Creator",
        description: "Generate visual text banners, quotes, and typographic graphic images online for free. Customize font, background gradient, layout, and resolution.",
        keywords: [
            "text to image generator free", "create graphic from text", "text banner maker online",
            "typographic image generator"
        ]
    },

    // --- Developer & Data Formatters ---
    "base64": {
        title: "Base64 Encoder & Decoder Tools Online Free — Text & Image Converter",
        description: "Encode strings, images, and files to Base64 or decode Base64 strings back to original format instantly. 100% private client-side processing.",
        keywords: [
            "base64 encoder online free", "base64 decoder", "image to base64 converter",
            "base64 to image decode", "string to base64 client side"
        ]
    },
    "jwt": {
        title: "JWT Decoder & Debugger Online Free — Decode JSON Web Tokens",
        description: "Decode and inspect JSON Web Tokens (JWT) online for free. View header, payload claims, expiration timestamps, and signatures securely client-side.",
        keywords: [
            "jwt decoder online free", "decode json web token", "jwt debugger client side",
            "inspect jwt payload", "jwt expiration check"
        ]
    },
    "json-formatter": {
        title: "JSON Formatter & Minifier Online Free — Beautify & Validate JSON",
        description: "Beautify, format, and minify JSON data online for free. Tree view viewer, syntax error checker, and client-side processing guaranteed.",
        keywords: [
            "json formatter online free", "json beautifier", "json minifier client side",
            "format json code", "json tree viewer"
        ]
    },
    "json-validator": {
        title: "JSON Validator & Parser Online Free — Check JSON Syntax Errors",
        description: "Validate JSON strings and files for syntax errors online for free. Highlights exact line numbers and error reasons with 100% client-side privacy.",
        keywords: [
            "json validator free online", "validate json schema", "json syntax error checker",
            "json parser online", "check valid json"
        ]
    },
    "json-diff": {
        title: "JSON Diff Checker Online Free — Compare Two JSON Objects",
        description: "Compare two JSON files or strings online for free. Highlights added, deleted, and modified key-value pairs side-by-side with color coding.",
        keywords: [
            "json diff checker free", "compare json online", "json difference tool",
            "side by side json compare", "json keys diff"
        ]
    },
    "json-to-xml": {
        title: "JSON to XML Converter Online Free — Convert JSON Data to XML",
        description: "Convert JSON objects into formatted XML strings online for free. Custom root tag options, client-side conversion, and instant download.",
        keywords: [
            "json to xml converter free", "convert json to xml online", "json to xml string",
            "client side json xml converter"
        ]
    },
    "yaml-json": {
        title: "YAML to JSON & JSON to YAML Converter Online Free",
        description: "Convert YAML files to JSON or JSON data to YAML online for free. Two-way data format converter for Docker, Kubernetes, and config files.",
        keywords: [
            "yaml to json converter free", "json to yaml online", "kubernetes yaml to json",
            "convert docker compose yaml to json"
        ]
    },
    "csv-json": {
        title: "CSV to JSON & JSON to CSV Converter Online Free",
        description: "Convert CSV spreadsheets to JSON arrays or JSON objects to CSV tables online for free. 100% client-side converter with custom delimiter controls.",
        keywords: [
            "csv to json converter free", "json to csv online", "convert csv data to json object",
            "excel csv to json array"
        ]
    },
    "csv-to-excel": {
        title: "CSV to Excel Converter Online Free — Convert CSV to XLSX",
        description: "Convert CSV files into Microsoft Excel spreadsheets (.xlsx) online for free. Formats numbers, dates, and text columns cleanly.",
        keywords: [
            "csv to excel converter free", "convert csv to xlsx online", "open csv in excel",
            "save csv as xlsx spreadsheet"
        ]
    },
    "excel-to-csv": {
        title: "Excel to CSV Converter Online Free — Convert XLSX to CSV",
        description: "Convert Excel files (.xlsx, .xls) to raw CSV spreadsheet format online for free. Fast table export for databases and scripts.",
        keywords: [
            "excel to csv converter free", "convert xlsx to csv online", "export excel sheet to csv",
            "save xlsx as comma separated csv"
        ]
    },
    "regex-tester": {
        title: "Regex Tester & Debugger Online Free — Test Regular Expressions",
        description: "Test and debug Regular Expressions (Regex) live in your browser for free. Real-time match highlighting, group capture details, and cheatsheet.",
        keywords: [
            "regex tester free online", "regular expression tester", "test regex online",
            "regex regex match highlighter", "javascript regex debugger"
        ]
    },
    "xml-tool": {
        title: "XML Formatter & Validator Online Free — Beautify & Minify XML",
        description: "Beautify, format, and validate XML documents online for free. Tree view viewer, syntax error detection, and XML minification.",
        keywords: [
            "xml formatter free online", "xml beautifier", "validate xml online",
            "xml minifier client side", "xml code viewer"
        ]
    },
    "sql-formatter": {
        title: "SQL Formatter & Beautifier Online Free — Format SQL Queries",
        description: "Format and beautify SQL queries online for free. Supports MySQL, PostgreSQL, SQLite, SQL Server, Oracle, and PL/SQL query formatting.",
        keywords: [
            "sql formatter free online", "sql beautifier", "format sql query",
            "mysql query formatter", "postgresql sql beautifier"
        ]
    },
    "sql-query-builder": {
        title: "Visual SQL Query Builder Online Free — Build SQL Queries Without Code",
        description: "Build SQL queries visually online for free. Select tables, joins, columns, filters, group by, and order by to generate clean SQL code.",
        keywords: [
            "sql query builder free", "visual sql builder online", "create sql select query visual",
            "sql join builder"
        ]
    },
    "code-minifier": {
        title: "Code Minifier Online Free — Compress HTML, CSS, JS & JSON",
        description: "Minify and compress HTML, CSS, JavaScript, JSON, and TypeScript code online for free. Strip white space, comments, and optimize web performance.",
        keywords: [
            "code minifier free online", "html minifier", "css minifier online",
            "js minifier free", "compress javascript code"
        ]
    },
    "hash-generator": {
        title: "Hash Generator & UUID Tool Online Free — MD5, SHA-256, SHA-512, UUID v4",
        description: "Generate MD5, SHA-1, SHA-256, SHA-512 cryptographic hashes and UUID v4 identifiers online for free. 100% client-side generation.",
        keywords: [
            "hash generator free online", "md5 generator", "sha256 hash generator",
            "uuid generator v4", "sha512 online tool"
        ]
    },
    "url-encoder": {
        title: "URL Encoder & Decoder Online Free — Encode/Decode URIs",
        description: "Encode or decode URLs and URI query parameters online for free. Converts special characters to % percent-encoded strings securely client-side.",
        keywords: [
            "url encoder online free", "url decoder", "encode uri component", "percent encoding tool"
        ]
    },
    "html-formatter": {
        title: "HTML Formatter & Beautifier Online Free — Format HTML Code",
        description: "Format, beautify, and clean up HTML code online for free. Fix indentations, format tags, and inspect HTML structure client-side.",
        keywords: [
            "html formatter free online", "html beautifier", "format html code", "indent html code"
        ]
    },
    "css-formatter": {
        title: "CSS Formatter & Beautifier Online Free — Format & Minify CSS",
        description: "Format and beautify CSS stylesheets online for free. Alphabetize properties, format rules, and minify production CSS.",
        keywords: [
            "css formatter free online", "css beautifier", "format css stylesheet", "minify css online"
        ]
    },
    "js-formatter": {
        title: "JS & TS Formatter Online Free — Beautify JavaScript & TypeScript",
        description: "Format and beautify JavaScript (.js) and TypeScript (.ts) code online for free. Custom indentation and bracket formatting.",
        keywords: [
            "js formatter free online", "javascript beautifier", "typescript code formatter", "format js code"
        ]
    },
    "case-converter": {
        title: "String Case Converter Online Free — camelCase, snake_case, UPPERCASE",
        description: "Convert text string cases online for free. Switch between Title Case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, and kebab-case.",
        keywords: [
            "case converter online free", "camelcase converter", "snake case converter",
            "uppercase to lowercase online", "text case switcher"
        ]
    },
    "text-diff": {
        title: "Text Diff Checker Online Free — Compare Two Text Files",
        description: "Compare two text files or code blocks side-by-side online for free. Highlights character and line differences with color coding.",
        keywords: [
            "text diff checker free", "compare text online", "text difference tool", "side by side text diff"
        ]
    },
    "text-to-word": {
        title: "Text to Word Converter Online Free — Convert TXT to DOCX",
        description: "Convert plain text (.txt) into Microsoft Word (.docx) documents online for free. Preserves formatting, line breaks, and fonts.",
        keywords: [
            "text to word converter free", "convert txt to docx online", "txt to word document"
        ]
    },
    "word-to-text": {
        title: "Word to Text Converter Online Free — Extract Plain Text from DOCX",
        description: "Extract clean plain text (.txt) from Microsoft Word (.docx, .doc) files online for free. Fast text extraction for analysis.",
        keywords: [
            "word to text converter free", "extract text from docx online", "doc to plain text"
        ]
    },
    "html-to-word": {
        title: "HTML to Word Converter Online Free — Convert HTML to DOCX",
        description: "Convert HTML files or styled code into editable Microsoft Word (.docx) documents online for free. Keeps tables, lists, and formatting.",
        keywords: [
            "html to word converter free", "convert html to docx online", "html string to word doc"
        ]
    },

    // --- OCR & Text Recognition Tools ---
    "ocr": {
        title: "Online OCR Tool Free — Extract Text from Image & PDF",
        description: "Extract editable text from images, scanned documents, and PDFs online for free using optical character recognition (OCR). Supports 50+ languages.",
        keywords: [
            "online ocr free", "extract text from image", "ocr image to text",
            "scanned pdf ocr online", "free text recognition tool"
        ]
    },
    "image-to-text": {
        title: "Image to Text OCR Online Free — Convert Photo to Text",
        description: "Convert photos, screenshots, and images into editable text online for free. Optical character recognition for JPG, PNG, and WebP.",
        keywords: [
            "image to text free", "photo to text ocr", "convert picture to text online",
            "extract text from screenshot"
        ]
    },
    "handwriting-ocr": {
        title: "Handwriting OCR Online Free — Convert Handwritten Notes to Text",
        description: "Recognize and convert handwritten notes, letters, and documents into digital editable text online for free with AI handwriting recognition.",
        keywords: [
            "handwriting ocr free", "convert handwritten notes to text", "handwriting recognition online",
            "scanned handwriting to digital text"
        ]
    },
    "receipt-ocr": {
        title: "Receipt & Invoice OCR Online Free — Extract Receipt Data",
        description: "Extract tabular data, total amounts, dates, and line items from scanned receipts and invoices online for free. Export to CSV or JSON.",
        keywords: [
            "receipt ocr free", "invoice text extractor", "scan receipt data online",
            "extract total from invoice photo"
        ]
    },
    "pdf-ocr-text": {
        title: "PDF Text OCR Online Free — Make Scanned PDF Searchable",
        description: "Run OCR on scanned PDF documents online for free. Extract selectable, searchable text from non-selectable scanned PDFs.",
        keywords: [
            "pdf text ocr free", "make scanned pdf searchable", "ocr on pdf pages",
            "extract non copyable text pdf"
        ]
    },
    "multilingual-ocr": {
        title: "Multilingual OCR Tool Online Free — 50+ Languages Text Recognition",
        description: "Extract text from documents written in over 50 languages (English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi) online for free.",
        keywords: [
            "multilingual ocr free", "foreign language text recognition", "spanish ocr online",
            "chinese ocr tool", "hindi ocr online"
        ]
    },

    // --- AI & Special Tools ---
    "resume-builder": {
        title: "AI Resume Builder Free Download — Create ATS-Friendly Resumes",
        description: "Build modern, professional, ATS-optimized resumes online for free with AI suggestions. Export clean PDF resumes instantly with zero registration.",
        keywords: [
            "ai resume builder free", "free online resume builder pdf", "ats friendly resume maker",
            "cv generator online free", "create resume without registration"
        ]
    },
    "drowChart": {
        title: "AI Flowchart & Diagram Maker Online Free — Create Diagrams",
        description: "Create visual flowcharts, mind maps, process diagrams, and architecture charts online for free. Export as SVG, PNG, or PDF.",
        keywords: [
            "ai flowchart maker free", "diagram maker online", "mind map generator free",
            "draw chart online", "process flow diagram builder"
        ]
    },
    "reel-rig-studio": {
        title: "Reel Rig Studio Online Free — Video & Short Clip Creator",
        description: "Create animated video reels, social media shorts, and dynamic video slides online for free directly in your web browser.",
        keywords: [
            "reel rig studio free", "social media reel maker online", "short video editor browser",
            "animated video slide creator"
        ]
    }
};
