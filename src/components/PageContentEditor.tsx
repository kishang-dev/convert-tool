import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { X, Save, Type, MousePointer2, Loader2, Grab } from "lucide-react";
import { fileAPI } from "@/lib/api";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" /></div>
});
import "react-quill-new/dist/quill.snow.css";

// Configure Quill to use inline styles for better PDF fidelity
const Q = (typeof window !== 'undefined') ? require('quill') : null;
const Quill = Q?.default || Q;
if (Quill && typeof Quill.import === 'function') {
    const SizeStyle = Quill.import('attributors/style/size');
    const ColorStyle = Quill.import('attributors/style/color');
    const AlignStyle = Quill.import('attributors/style/align');

    // Allow any pixel value for size
    SizeStyle.whitelist = null;

    Quill.register(SizeStyle, true);
    Quill.register(ColorStyle, true);
    Quill.register(AlignStyle, true);
}

interface TextItem {
    str: string;
    x: number;
    y: number;
    originalY: number;
    width: number;
    height: number;
    fontSize: number; // Original font size
    fontName: string;
    hasEOL: boolean;
    transform: number[];
}

interface Modification {
    id: string;
    type: "replace" | "add";
    text: string;
    x: number;
    y: number;
    size: number;
    color?: string;
    originalX?: number; // For replace
    originalY?: number; // For replace
    originalWidth?: number; // For replace
    originalHeight?: number; // For replace
    boxWidth?: number;
    boxHeight?: number;
    backgroundColor?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isSerif?: boolean;
}

interface PageContentEditorProps {
    fileId: string;
    pageIndex: number;
    imageUrl: string;
    onClose: () => void;
    onSave: (newFileId: string) => void;
}

export default function PageContentEditor({
    fileId,
    pageIndex,
    imageUrl,
    onClose,
    onSave,
}: PageContentEditorProps) {
    const [items, setItems] = useState<TextItem[]>([]);
    const [groupedItems, setGroupedItems] = useState<TextItem[]>([]);

    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<"select" | "add">("select");
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const editorWrapperRef = useRef<HTMLDivElement>(null);
    const [editorContent, setEditorContent] = useState("");
    const [blockContents, setBlockContents] = useState<Record<string, string>>({});
    const [pdfDims, setPdfDims] = useState<{ width: number; height: number } | null>(null);
    const [activeColor, setActiveColor] = useState("#000000");
    const [activeSize, setActiveSize] = useState(12);

    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'size': [] }],
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ]
    }), []);

    const quillFormats = [
        'size', 'bold', 'italic', 'underline', 'color', 'background', 'align', 'list', 'bullet'
    ];

    // 1. Initialize block-based contents
    useEffect(() => {
        if (groupedItems.length > 0 && pdfDims) {
            const initialContents: Record<string, string> = {};
            groupedItems.forEach((item, idx) => {
                const centerX = item.x + item.width / 2;
                const pageMiddle = pdfDims.width / 2;
                const isCentered = Math.abs(centerX - pageMiddle) < (pdfDims.width * 0.1);

                const alignClass = isCentered ? 'ql-align-center' : '';
                const fontSize = `${item.fontSize * scale}px`;

                // Bold/Italic Detection from fontName
                const fn = (item.fontName || "").toLowerCase();
                const isBold = fn.includes('bold') || fn.includes('700') || fn.includes('black');
                const isItalic = fn.includes('italic') || fn.includes('oblique');
                const isSerif = fn.includes('serif') || fn.includes('times') || fn.includes('roman') || fn.includes('georgia') || fn.includes('minion') || fn.includes('cambria') || fn.includes('garamond') || fn.includes('book') || fn.includes('liberation') || fn.includes('bitstream');
                const fontFamily = isSerif ? "'Times New Roman', serif" : "Arial, sans-serif";

                let content = item.str;
                if (isItalic) content = `<em>${content}</em>`;
                if (isBold) content = `<strong>${content}</strong>`;

                const wrappedContent = `<p class="${alignClass}" style="font-size: ${fontSize}; font-family: ${fontFamily}; line-height: 1.2;">${content}</p>`;
                initialContents[`block-${idx}`] = wrappedContent;
            });
            setBlockContents(initialContents);
        }
    }, [groupedItems, pdfDims, scale]);

    const handleBlockChange = (id: string, content: string) => {
        setBlockContents(prev => ({ ...prev, [id]: content }));
    };

    // 1. Load Text Data (PDF Coordinates)
    useEffect(() => {
        loadText();
    }, [fileId, pageIndex]);

    const loadText = async () => {
        try {
            setLoading(true);
            const res = await fileAPI.getPageText(fileId, pageIndex);
            if (res.success) {
                const itemsWithFontSize = res.data.items.map((it: any) => ({ ...it, fontSize: it.height }));
                setItems(itemsWithFontSize);
                setPdfDims({ width: res.data.width, height: res.data.height });
                setGroupedItems(groupTextItems(itemsWithFontSize));
            }
        } catch (error) {
            console.error("Failed to load text", error);
        } finally {
            setLoading(false);
        }
    };



    // Helper to group PDF text fragments into lines and then paragraphs
    const groupTextItems = (rawItems: TextItem[]): TextItem[] => {
        if (!rawItems.length) return [];

        // 1. Group fragments into visual lines
        // Sort by Y first, then X
        const sortedFragments = [...rawItems].sort((a, b) => {
            const yDiff = Math.abs(a.y - b.y);
            if (yDiff < (Math.min(a.height, b.height) * 0.5)) return a.x - b.x;
            return a.y - b.y;
        });

        const lines: TextItem[] = [];
        let currentLine: TextItem | null = null;

        sortedFragments.forEach(item => {
            if (!currentLine) {
                currentLine = { ...item };
                return;
            }

            // Check if on same visual line plane
            const isSameLinePlane = Math.abs(item.y - currentLine.y) < (currentLine.height * 0.8);
            // Check if roughly adjacent horizontally (allow for spaces/tabs)
            const gap = item.x - (currentLine.x + currentLine.width);
            const isAdjacent = gap > -10 && gap < 20; // Very tight for merging fragments within words

            if (isSameLinePlane && isAdjacent) {
                // PDFs often split words into multiple fragments. 
                // A space is typically > 25% of font height.
                const spaceThreshold = currentLine.height * 0.25;
                const needsSpace = gap > spaceThreshold;

                currentLine.str += (needsSpace ? " " : "") + item.str;
                currentLine.width = (item.x + item.width) - currentLine.x;
                currentLine.height = Math.max(currentLine.height, item.height);
            } else {
                lines.push(currentLine);
                currentLine = { ...item };
            }
        });
        if (currentLine) lines.push(currentLine);

        // 2. Group lines into logical paragraphs/blocks
        // Sort lines purely by Y to process top-down
        lines.sort((a, b) => a.y - b.y);

        const blocks: TextItem[] = [];
        if (lines.length === 0) return blocks;

        // State for block merging
        let currentBlock = { ...lines[0] };
        currentBlock.fontSize = lines[0].height; // Base font size from first line
        let lastLineBottom = currentBlock.y + currentBlock.height;
        let baseFontSize = currentBlock.fontSize;
        if (!baseFontSize || baseFontSize < 2) baseFontSize = 12; // Fallback

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            // Calculate vertical gap between bottom of previous line in block and top of this line
            const gap = line.y - lastLineBottom;

            // Heuristics for merging:
            // 1. Vertical proximity: Tighten to keep paragraphs distinct
            const isCloseVertically = gap < (baseFontSize * 0.3) && gap > -(baseFontSize * 0.1);

            // 2. Alignment: Left side should be closely aligned
            const isAligned = Math.abs(line.x - currentBlock.x) < 30;

            // 3. Font Size: Should match closely
            const isSameSize = Math.abs(line.height - baseFontSize) < 2;

            // 4. Check for list markers at start of lines (don't merge distinct bulleted items)
            const isListStart = /^[\u2022\u00b7\u25cf\u25cb\u25aa\*-]\s+/.test(line.str.trim());

            if (isCloseVertically && isAligned && isSameSize && !isListStart) {
                // Merge line into block
                currentBlock.str += " " + line.str;

                // Expand dimensions
                const blockRight = currentBlock.x + currentBlock.width;
                const lineRight = line.x + line.width;
                currentBlock.width = Math.max(blockRight, lineRight) - currentBlock.x;

                // Update height to encompass this new line
                const newBottom = line.y + line.height;
                currentBlock.height = newBottom - currentBlock.y;

                // Update state
                lastLineBottom = newBottom;
            } else {
                // Push finished block
                blocks.push(currentBlock);

                // Start new block
                currentBlock = { ...line };
                currentBlock.fontSize = line.height;
                lastLineBottom = currentBlock.y + currentBlock.height;
                baseFontSize = currentBlock.fontSize;
            }
        }
        blocks.push(currentBlock);

        return blocks;
    };

    // 2. Calculate Scale
    useEffect(() => {
        const updateScale = () => {
            if (imageRef.current && pdfDims) {
                const renderedWidth = imageRef.current.offsetWidth;
                const newScale = renderedWidth / pdfDims.width;
                setScale(newScale);
            }
        };
        window.addEventListener("resize", updateScale);
        if (imageRef.current && pdfDims) updateScale();
        return () => window.removeEventListener("resize", updateScale);
    }, [pdfDims]);

    const handleImageLoad = () => {
        if (imageRef.current && pdfDims) {
            const renderedWidth = imageRef.current.offsetWidth;
            setScale(renderedWidth / pdfDims.width);
        }
    };



    const handleSave = async () => {
        try {
            setSaving(true);

            // 1. Redact all original items
            const redactionMods: Modification[] = items.map((item, idx) => ({
                id: `redact-${idx}`,
                type: "replace",
                text: "",
                x: item.x,
                y: item.y,
                size: item.fontSize,
                originalX: item.x,
                originalY: item.originalY,
                originalWidth: item.width,
                originalHeight: item.fontSize * 1.5, // More aggressive masking
            }));

            // 2. Extract content from each block
            const contentMods: Modification[] = [];

            Object.entries(blockContents).forEach(([id, html]) => {
                const idx = parseInt(id.split('-')[1]);
                const item = groupedItems[idx];
                if (!item) return;

                const temp = document.createElement('div');
                temp.innerHTML = html;
                const paragraphs = Array.from(temp.querySelectorAll('p, li, h1, h2, h3'));

                paragraphs.forEach((p, pIdx) => {
                    let text = (p as HTMLElement).innerText.trim();
                    if (!text) return;

                    // Handle list markers manually since innerText strips them
                    if (p.tagName === 'LI') {
                        const parent = p.parentElement;
                        if (parent?.tagName === 'OL') {
                            const index = Array.from(parent.children).indexOf(p) + 1;
                            text = `${index}. ${text}`;
                        } else {
                            text = `• ${text}`;
                        }
                    }

                    const fn = (item.fontName || "").toLowerCase();
                    const isSerif = fn.includes('serif') || fn.includes('times') || fn.includes('roman') || fn.includes('georgia') || fn.includes('minion') || fn.includes('cambria') || fn.includes('garamond') || fn.includes('book') || fn.includes('liberation') || fn.includes('bitstream');

                    contentMods.push({
                        id: `add-b-${idx}-${pIdx}`,
                        type: "add" as const,
                        text: text,
                        x: item.x,
                        y: item.y + (pIdx * (item.fontSize * 1.2)), // Use standard line height for offset
                        size: item.fontSize,
                        boxWidth: item.width,
                        color: "#000000",
                        isBold: (p as HTMLElement).querySelector('strong, b') !== null || (p as HTMLElement).style.fontWeight === 'bold',
                        isItalic: (p as HTMLElement).querySelector('em, i') !== null || (p as HTMLElement).style.fontStyle === 'italic',
                        isSerif: isSerif
                    });
                });
            });





            const res = await fileAPI.savePageContent(fileId, pageIndex, [...redactionMods, ...contentMods]);
            if (res.success) {
                onSave(res.file._id);
                onClose();
            }
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col backdrop-blur-sm">
            {/* Toolbar */}
            <div className="bg-white p-4 flex items-center justify-between shadow-md z-50">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold">Edit Content (Page {pageIndex + 1})</h2>
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setMode("select")}
                            className={`p-2 rounded flex items-center gap-2 ${mode === "select" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
                        >
                            <MousePointer2 size={18} />
                            <span className="text-sm font-medium">Select</span>
                        </button>
                        <button
                            onClick={() => setMode("add")}
                            className={`p-2 rounded flex items-center gap-2 ${mode === "add" ? "bg-white shadow text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
                        >
                            <Type size={18} />
                            <span className="text-sm font-medium">Text</span>
                        </button>
                    </div>

                    {/* Style Controls */}
                    <div className="flex items-center gap-2 border-l pl-4">
                        <div className="flex items-center bg-gray-100 rounded p-1">
                            <span className="text-xs text-gray-500 px-2">Size</span>
                            <input
                                type="number"
                                className="w-12 bg-transparent text-sm text-center outline-none"
                                value={activeSize}
                                onChange={(e) => setActiveSize(Number(e.target.value))}
                            />
                        </div>
                        <input
                            type="color"
                            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                            value={activeColor}
                            onChange={(e) => setActiveColor(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="px-4 py-2 hover:bg-gray-100 rounded text-gray-700 font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Workspace */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-900/50 cursor-grab active:cursor-grabbing">
                <div className="relative shadow-2xl bg-white" ref={containerRef}>
                    {/* Base Image */}
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Page Background"
                        onLoad={handleImageLoad}
                        className="max-w-[1000px] w-full h-auto block select-none pointer-events-none"
                        style={{ minWidth: '600px' }}
                    />

                    {/* Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                            <div className="flex flex-col items-center gap-2 text-blue-600">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="font-semibold">Analyzing text positions...</span>
                            </div>
                        </div>
                    )}

                    {/* -------------------- BLOCK-BASED Editor Layer -------------------- */}
                    {!loading && pdfDims && (
                        <div
                            className="absolute inset-0 z-20 pointer-events-none"
                            style={{ width: pdfDims.width * scale, height: pdfDims.height * scale }}
                        >
                            <style>{`
                                .ql-container.ql-snow { border: none !important; }
                                .ql-editor { 
                                    padding: 0 !important; 
                                    overflow: visible !important; 
                                    line-height: normal !important; 
                                    color: #000000 !important;
                                }
                                .block-editor-item { 
                                    position: absolute; 
                                    background: white; 
                                    pointer-events: auto; 
                                    transition: outline 0.1s, box-shadow 0.1s;
                                    min-width: 20px;
                                }
                                .block-editor-item:hover { 
                                    outline: 1px dashed #3b82f6; 
                                    box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
                                }
                                .block-editor-item:focus-within { 
                                    outline: 2px solid #3b82f6; 
                                    z-index: 50; 
                                    box-shadow: 0 0 12px rgba(59, 130, 246, 0.3);
                                }
                                .block-editor-item .ql-editor p {
                                    margin: 0;
                                }
                                .block-editor-item .ql-editor p.ql-align-center { text-align: center; }
                                .block-editor-item .ql-editor p.ql-align-right { text-align: right; }

                                .quill-floating-toolbar { 
                                    position: fixed;
                                    top: 80px;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    background: white;
                                    border: 1px solid #e2e8f0 !important; 
                                    z-index: 1000;
                                    border-radius: 8px;
                                    width: auto;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                    padding: 4px 12px;
                                }
                            `}</style>

                            <div id="toolbar-container" className="quill-floating-toolbar">
                                <span className="ql-formats">
                                    <select className="ql-size">
                                        <option value="small"></option>
                                        <option defaultValue=""></option>
                                        <option value="large"></option>
                                        <option value="huge"></option>
                                    </select>
                                    <button className="ql-bold"></button>
                                    <button className="ql-italic"></button>
                                    <button className="ql-underline"></button>
                                </span>
                                <span className="ql-formats">
                                    <select className="ql-color"></select>
                                    <select className="ql-background"></select>
                                </span>
                                <span className="ql-formats">
                                    <button className="ql-align" value=""></button>
                                    <button className="ql-align" value="center"></button>
                                    <button className="ql-align" value="right"></button>
                                </span>
                                <span className="ql-formats">
                                    <button className="ql-clean"></button>
                                </span>
                            </div>

                            {groupedItems.map((item, idx) => (
                                <div
                                    key={`block-wrapper-${idx}`}
                                    className="block-editor-item"
                                    style={{
                                        left: item.x * scale,
                                        top: (item.y - (item.fontSize * 0.9)) * scale, // Improved baseline adjustment
                                        width: (item.width + 40) * scale, // More generous width
                                        minHeight: (item.height + 5) * scale, // Block coverage
                                    }}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={blockContents[`block-${idx}`] || ""}
                                        onChange={(content) => handleBlockChange(`block-${idx}`, content)}
                                        modules={{
                                            toolbar: '#toolbar-container'
                                        }}
                                        formats={quillFormats}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}