import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Save, Loader2, ChevronLeft, Undo2, AlertCircle,
    FileText, Columns, Layers, Edit3, AlignLeft, Check, X, RefreshCw, Eye
} from "lucide-react";
import { fileAPI } from "@/lib/api";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface TextItem {
    str: string; x: number; y: number; originalY: number;
    width: number; height: number; fontSize: number;
    fontName: string; hasEOL: boolean; transform: number[];
    color?: string;
}

interface Modification {
    id: string;
    type: "replace" | "add";
    text?: string;
    x: number; y: number;
    size?: number; color?: string;
    originalX?: number; originalY?: number;
    originalWidth?: number; originalHeight?: number;
    originalText?: string;
    align?: "left" | "center" | "right";
}

interface Paragraph {
    id: string;
    lines: TextItem[];
    fullText: string;
    x: number; y: number;
    width: number; height: number;
    fontSize: number; fontName: string;
}

interface PageContentEditorProps {
    fileId: string; pageIndex: number; imageUrl: string;
    onClose: () => void; onSave: (newFileId: string) => void;
}

// ─────────────────────────────────────────────
//  Edit Modes
// ─────────────────────────────────────────────
type EditMode =
    | "full-doc"        // Mode 1 — One giant textarea
    | "split-view"      // Mode 2 — PDF left / text editor right
    | "paragraph"       // Mode 3 — Click paragraph block
    | "overlay"         // Mode 4 — Translucent overlay textarea on top of PDF
    | "line"            // Mode 5 — Original line-by-line

const MODES = [
    { id: "full-doc", icon: FileText, label: "Full Doc", desc: "Edit all text at once in one editor" },
    { id: "split-view", icon: Columns, label: "Split View", desc: "PDF left, live text editor right" },
    { id: "paragraph", icon: AlignLeft, label: "Paragraphs", desc: "Click any paragraph to edit it whole" },
    { id: "overlay", icon: Layers, label: "Overlay", desc: "Transparent editor directly over PDF" },
    { id: "line", icon: Edit3, label: "Line", desc: "Original line-by-line editing" },
] as const;

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
const groupIntoLines = (raw: TextItem[]): TextItem[] => {
    if (!raw.length) return [];
    const sorted = [...raw].sort((a, b) =>
        Math.abs(a.y - b.y) < 4 ? a.x - b.x : a.y - b.y
    );
    const merged: TextItem[] = [];
    let cur = { ...sorted[0] };
    for (let i = 1; i < sorted.length; i++) {
        const it = sorted[i];
        const sameLine = Math.abs(it.y - cur.y) < cur.height * 0.4;
        const near = it.x - (cur.x + cur.width) < 40;
        if (sameLine && near) {
            const gap = it.x - (cur.x + cur.width);
            cur.str += gap > 2 ? " " + it.str : it.str;
            cur.width = it.x + it.width - cur.x;
            cur.height = Math.max(cur.height, it.height);
            cur.fontSize = Math.max(cur.fontSize, it.fontSize);
        } else {
            merged.push(cur);
            cur = { ...it };
        }
    }
    merged.push(cur);
    return merged;
};

/** Group lines into paragraphs (gap > 1.5× line height = new paragraph) */
const groupIntoParagraphs = (lines: TextItem[]): Paragraph[] => {
    if (!lines.length) return [];
    const paras: Paragraph[] = [];
    let group: TextItem[] = [lines[0]];

    for (let i = 1; i < lines.length; i++) {
        const prev = group[group.length - 1];
        const gap = lines[i].y - (prev.y + prev.height);
        if (gap > prev.height * 1.5) {
            paras.push(buildParagraph(group, paras.length));
            group = [];
        }
        group.push(lines[i]);
    }
    if (group.length) paras.push(buildParagraph(group, paras.length));
    return paras;
};

const buildParagraph = (lines: TextItem[], idx: number): Paragraph => {
    const xs = lines.map(l => l.x);
    const x = Math.min(...xs);
    const y = lines[0].y;
    const width = Math.max(...lines.map(l => l.x + l.width)) - x;
    const height = lines[lines.length - 1].y + lines[lines.length - 1].height - y;
    const fullText = lines.map(l => l.str).join(" ");
    const fontSize = Math.max(...lines.map(l => l.fontSize));
    const fontName = lines[0].fontName || "";
    return { id: `para-${idx}`, lines, fullText, x, y, width, height, fontSize, fontName };
};

// ─────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────
export default function PageContentEditor({
    fileId, pageIndex, imageUrl, onClose, onSave,
}: PageContentEditorProps) {
    const [lines, setLines] = useState<TextItem[]>([]);
    const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
    const [pdfDims, setPdfDims] = useState<{ width: number; height: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [scale, setScale] = useState(1);
    const [mode, setMode] = useState<EditMode>("full-doc");

    // ── Mode 1 & 2: Full-doc / split-view ──
    const [fullDocText, setFullDocText] = useState("");
    const [originalFullText, setOriginalFullText] = useState("");

    // ── Mode 3: Paragraph editing ──
    const [paraEdits, setParaEdits] = useState<Record<string, string>>({});
    const [activePara, setActivePara] = useState<string | null>(null);
    const [paraEditVal, setParaEditVal] = useState("");

    // ── Mode 4: Overlay editing ──
    const [overlayText, setOverlayText] = useState("");
    const [originalOverlay, setOriginalOverlay] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);

    // ── Mode 5: Line-by-line ──
    const [lineEdits, setLineEdits] = useState<Record<string, string>>({});
    const [activeLineId, setActiveLineId] = useState<string | null>(null);
    const [lineEditVal, setLineEditVal] = useState("");

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const lineInputRef = useRef<HTMLInputElement>(null);
    const paraInputRef = useRef<HTMLTextAreaElement>(null);

    // ── Load data ──
    useEffect(() => { loadData(); }, [fileId, pageIndex]);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await fileAPI.getPageText(fileId, pageIndex);
            if (res.success) {
                const raw: TextItem[] = res.data.items.map((it: any) => ({ ...it, fontSize: it.height }));
                setPdfDims({ width: res.data.width, height: res.data.height });
                const grouped = groupIntoLines(raw);
                setLines(grouped);
                const paras = groupIntoParagraphs(grouped);
                setParagraphs(paras);

                const fullText = grouped.map(l => l.str).join("\n");
                setFullDocText(fullText);
                setOriginalFullText(fullText);
                setOverlayText(fullText);
                setOriginalOverlay(fullText);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // ── Scale on resize ──
    useEffect(() => {
        const update = () => {
            if (imageRef.current && pdfDims)
                setScale(imageRef.current.offsetWidth / pdfDims.width);
        };
        window.addEventListener("resize", update);
        update();
        return () => window.removeEventListener("resize", update);
    }, [pdfDims]);

    // ── Auto-focus ──
    useEffect(() => { if (activeLineId && lineInputRef.current) lineInputRef.current.focus(); }, [activeLineId]);
    useEffect(() => { if (activePara && paraInputRef.current) paraInputRef.current.focus(); }, [activePara]);

    // ─────────────────────────────────────────
    //  Build Modifications for Save
    // ─────────────────────────────────────────
    const buildMods = (): Modification[] => {
        const mods: Modification[] = [];

        if (mode === "full-doc" || mode === "split-view" || mode === "overlay") {
            const currentText = mode === "overlay" ? overlayText : fullDocText;
            const origText = mode === "overlay" ? originalOverlay : originalFullText;

            if (currentText !== origText) {
                const newLines = currentText.split("\n");
                const maxIdx = Math.max(lines.length, newLines.length);

                for (let idx = 0; idx < maxIdx; idx++) {
                    const line = lines[idx];
                    const newText = newLines[idx];

                    if (line && newText !== undefined) {
                        // Modified line
                        if (newText !== line.str) {
                            const isCenter = pdfDims ? Math.abs((line.x + line.width / 2) - (pdfDims.width / 2)) < 25 : false;
                            mods.push({
                                id: `edit-${idx}`, type: "replace", text: newText,
                                x: line.x, y: line.y, size: line.fontSize, color: line.color || "#000000",
                                originalX: line.x, originalY: line.originalY, originalText: line.str,
                                originalWidth: line.width, originalHeight: line.height,
                                align: isCenter ? "center" : "left",
                            });
                        }
                    } else if (line && newText === undefined) {
                        // Deleted line
                        mods.push({
                            id: `edit-${idx}`, type: "replace", text: "",
                            x: line.x, y: line.y, size: line.fontSize, color: line.color || "#000000",
                            originalX: line.x, originalY: line.originalY, originalText: line.str,
                            originalWidth: line.width, originalHeight: line.height,
                        });
                    } else if (!line && newText !== undefined && newText.trim().length > 0) {
                        // Added line
                        const last = lines[lines.length - 1] || { x: 50, y: 100, fontSize: 12, height: 12, color: "#000000" };
                        const offset = (idx - lines.length + 1) * (last.fontSize * 1.5);
                        mods.push({
                            id: `add-${idx}`, type: "add", text: newText,
                            x: last.x, y: last.y + offset, size: last.fontSize, color: last.color || "#000000",
                        });
                    }
                }
            }
        }

        else if (mode === "paragraph") {
            Object.entries(paraEdits).forEach(([pid, newText]) => {
                const para = paragraphs.find(p => p.id === pid);
                if (!para) return;

                const newLineTexts = newText.split("\n");
                const maxIdx = Math.max(para.lines.length, newLineTexts.length);

                for (let li = 0; li < maxIdx; li++) {
                    const line = para.lines[li];
                    const nt = newLineTexts[li];

                    if (line && nt !== undefined) {
                        if (nt !== line.str) {
                            const isCenter = pdfDims ? Math.abs((line.x + line.width / 2) - (pdfDims.width / 2)) < 25 : false;
                            mods.push({
                                id: `${pid}-${li}`, type: "replace", text: nt,
                                x: line.x, y: line.y, size: line.fontSize, color: line.color || "#000000",
                                originalX: line.x, originalY: line.originalY, originalText: line.str,
                                originalWidth: line.width, originalHeight: line.height,
                                align: isCenter ? "center" : "left",
                            });
                        }
                    } else if (line && nt === undefined) {
                        mods.push({
                            id: `${pid}-${li}`, type: "replace", text: "",
                            x: line.x, y: line.y, size: line.fontSize, color: line.color || "#000000",
                            originalX: line.x, originalY: line.originalY, originalText: line.str,
                            originalWidth: line.width, originalHeight: line.height,
                        });
                    } else if (!line && nt !== undefined && nt.trim().length > 0) {
                        const last = para.lines[para.lines.length - 1];
                        const offset = (li - para.lines.length + 1) * (last.fontSize * 1.5);
                        mods.push({
                            id: `${pid}-add-${li}`, type: "add", text: nt,
                            x: last.x, y: last.y + offset, size: last.fontSize, color: last.color || "#000000",
                        });
                    }
                }
            });
        }

        else if (mode === "line") {
            Object.entries(lineEdits).forEach(([id, newText]) => {
                const idx = parseInt(id.split("-")[1]);
                const line = lines[idx];
                if (!line) return;

                if (newText !== line.str) {
                    const isCenter = pdfDims ? Math.abs((line.x + line.width / 2) - (pdfDims.width / 2)) < 25 : false;
                    mods.push({
                        id: `edit-${idx}`, type: "replace", text: newText,
                        x: line.x, y: line.y, size: line.fontSize, color: line.color || "#000000",
                        originalX: line.x, originalY: line.originalY, originalText: line.str,
                        originalWidth: line.width, originalHeight: line.height,
                        align: isCenter ? "center" : "left",
                    });
                }
            });
        }

        return mods;
    };

    const handleSave = async () => {
        const mods = buildMods();
        if (!mods.length) return;
        try {
            setSaving(true);
            const res = await fileAPI.savePageContent(fileId, pageIndex, mods);
            if (res.success) { onSave(res.file._id); onClose(); }
        } catch (e) { console.error(e); } finally { setSaving(false); }
    };

    const hasChanges = (() => {
        if (mode === "full-doc" || mode === "split-view") return fullDocText !== originalFullText;
        if (mode === "overlay") return overlayText !== originalOverlay;
        if (mode === "paragraph") return Object.keys(paraEdits).length > 0;
        if (mode === "line") return Object.keys(lineEdits).length > 0;
        return false;
    })();

    const resetAll = () => {
        setFullDocText(originalFullText);
        setOverlayText(originalOverlay);
        setParaEdits({});
        setLineEdits({});
        setActivePara(null);
        setActiveLineId(null);
        setShowOverlay(false);
    };

    // ─────────────────────────────────────────
    //  Render
    // ─────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0f1117] text-slate-100 font-sans overflow-hidden">
            {/* ── Header ── */}
            <header className="bg-[#1a1d27] border-b border-white/10 px-6 py-3 flex items-center justify-between z-[120] shadow-lg">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                            PDF Content Editor
                            <span className="text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                                5 Modes
                            </span>
                        </h1>
                        <p className="text-[11px] text-slate-500 mt-0.5">Choose your preferred editing mode below</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <>
                            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <AlertCircle size={12} /> Unsaved changes
                            </span>
                            <button onClick={resetAll} className="px-3 py-2 text-xs font-bold rounded-lg border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all flex items-center gap-1.5">
                                <RefreshCw size={13} /> Reset
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving || !hasChanges}
                        className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:bg-slate-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-violet-900/40"
                    >
                        {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                        Save PDF
                    </button>
                </div>
            </header>

            {/* ── Mode Switcher ── */}
            <div className="bg-[#13151f] border-b border-white/10 px-6 py-2 flex items-center gap-2 z-[110]">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2">Mode:</span>
                {MODES.map(m => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id as EditMode)}
                        title={m.desc}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${mode === m.id
                            ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-900/40"
                            : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <m.icon size={12} />
                        {m.label}
                    </button>
                ))}
                <span className="ml-3 text-[11px] text-slate-500 hidden md:block italic">
                    {MODES.find(m => m.id === mode)?.desc}
                </span>
            </div>

            {/* ── Body ── */}
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-violet-400" size={48} />
                    <p className="text-sm text-slate-400 font-medium">Loading document…</p>
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    {/* ═══════════════════════════════════════════════════════
                        MODE 1 — FULL DOC EDITOR
                        Single textarea with ALL text. Edit everything at once.
                    ═══════════════════════════════════════════════════════ */}
                    {mode === "full-doc" && (
                        <FullDocMode
                            imageUrl={imageUrl}
                            value={fullDocText}
                            onChange={setFullDocText}
                            originalValue={originalFullText}
                        />
                    )}

                    {/* ═══════════════════════════════════════════════════════
                        MODE 2 — SPLIT VIEW
                        PDF rendered on the left, text editor on the right.
                    ═══════════════════════════════════════════════════════ */}
                    {mode === "split-view" && (
                        <SplitViewMode
                            imageUrl={imageUrl}
                            imageRef={imageRef}
                            pdfDims={pdfDims}
                            scale={scale}
                            value={fullDocText}
                            onChange={setFullDocText}
                        />
                    )}

                    {/* ═══════════════════════════════════════════════════════
                        MODE 3 — PARAGRAPH BLOCK EDITING
                        Click a whole paragraph to edit it as one text area.
                    ═══════════════════════════════════════════════════════ */}
                    {mode === "paragraph" && (
                        <ParagraphMode
                            imageUrl={imageUrl}
                            imageRef={imageRef}
                            containerRef={containerRef}
                            paragraphs={paragraphs}
                            pdfDims={pdfDims}
                            scale={scale}
                            paraEdits={paraEdits}
                            setParaEdits={setParaEdits}
                            activePara={activePara}
                            setActivePara={setActivePara}
                            paraEditVal={paraEditVal}
                            setParaEditVal={setParaEditVal}
                            paraInputRef={paraInputRef}
                        />
                    )}

                    {/* ═══════════════════════════════════════════════════════
                        MODE 4 — OVERLAY EDITOR
                        Semi-transparent textarea floated directly over the PDF.
                    ═══════════════════════════════════════════════════════ */}
                    {mode === "overlay" && (
                        <OverlayMode
                            imageUrl={imageUrl}
                            imageRef={imageRef}
                            containerRef={containerRef}
                            pdfDims={pdfDims}
                            scale={scale}
                            value={overlayText}
                            onChange={setOverlayText}
                            showOverlay={showOverlay}
                            setShowOverlay={setShowOverlay}
                        />
                    )}

                    {/* ═══════════════════════════════════════════════════════
                        MODE 5 — LINE BY LINE (original)
                    ═══════════════════════════════════════════════════════ */}
                    {mode === "line" && (
                        <LineMode
                            imageUrl={imageUrl}
                            imageRef={imageRef}
                            containerRef={containerRef}
                            lines={lines}
                            pdfDims={pdfDims}
                            scale={scale}
                            lineEdits={lineEdits}
                            setLineEdits={setLineEdits}
                            activeLineId={activeLineId}
                            setActiveLineId={setActiveLineId}
                            lineEditVal={lineEditVal}
                            setLineEditVal={setLineEditVal}
                            lineInputRef={lineInputRef}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODE 1 — Full Document Editor
//  Shows PDF thumbnail + one big textarea with all text.
// ─────────────────────────────────────────────────────────────────────────────
function FullDocMode({
    imageUrl, value, onChange, originalValue,
}: {
    imageUrl: string; value: string; onChange: React.Dispatch<React.SetStateAction<string>>; originalValue: string;
}) {
    const lineCount = value.split("\n").length;
    const changed = value.split("\n").filter((l, i) => l !== originalValue.split("\n")[i]).length;

    return (
        <div className="h-full flex gap-0 overflow-hidden">
            {/* Left: Thumbnail */}
            <div className="w-56 flex-shrink-0 bg-[#0d0f18] border-r border-white/10 overflow-y-auto flex flex-col items-center py-6 gap-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PDF Preview</p>
                <div className="w-44 shadow-xl rounded overflow-hidden border border-white/10">
                    <img src={imageUrl} alt="PDF" className="w-full h-auto block" />
                </div>
                <div className="mt-2 px-4 w-full space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Total lines</span><span className="text-slate-300 font-bold">{lineCount}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Modified</span>
                        <span className={changed > 0 ? "text-amber-400 font-bold" : "text-slate-300 font-bold"}>{changed}</span>
                    </div>
                </div>
                <div className="mt-4 px-4 w-full">
                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3 text-[10px] text-violet-300 leading-relaxed">
                        <strong className="block mb-1">✦ Mode 1: Full Doc</strong>
                        Edit the entire PDF text in this editor. Each line corresponds to one line in the PDF. Save when done.
                    </div>
                </div>
            </div>

            {/* Right: Editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1117]">
                <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3">
                    <FileText size={14} className="text-violet-400" />
                    <span className="text-xs font-bold text-slate-300">Full Document Text Editor</span>
                    <span className="text-[10px] text-slate-500 ml-auto">Each line = one PDF text line. Edit freely.</span>
                </div>
                <div className="flex flex-1 overflow-hidden">
                    {/* Line numbers */}
                    <div className="bg-[#0d0f18] border-r border-white/10 py-4 px-3 overflow-hidden select-none" style={{ minWidth: 48 }}>
                        {value.split("\n").map((_, i) => (
                            <div key={i} className="text-[11px] text-slate-600 text-right leading-6 font-mono">{i + 1}</div>
                        ))}
                    </div>
                    {/* Textarea */}
                    <textarea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        spellCheck={false}
                        className="flex-1 bg-transparent text-slate-200 text-sm leading-6 font-mono resize-none outline-none py-4 px-4 overflow-auto"
                        style={{ tabSize: 4 }}
                    />
                    {/* Diff highlight sidebar */}
                    <div className="w-1 flex-shrink-0">
                        {value.split("\n").map((l, i) => (
                            <div
                                key={i}
                                className="h-6"
                                style={{ backgroundColor: l !== originalValue.split("\n")[i] ? "#f59e0b" : "transparent" }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODE 2 — Split View
//  PDF on left (live), text editor on right — changes reflect visually in PDF.
// ─────────────────────────────────────────────────────────────────────────────
interface SplitViewModeProps {
    imageUrl: string;
    imageRef: any;
    pdfDims: { width: number; height: number } | null;
    scale: number;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
}

function SplitViewMode({
    imageUrl, imageRef, pdfDims, scale, value, onChange,
}: SplitViewModeProps) {
    return (
        <div className="h-full flex overflow-hidden">
            {/* Left: PDF */}
            <div className="flex-1 overflow-auto bg-[#0d0f18] flex flex-col items-center py-8 border-r border-white/10">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Eye size={11} /> Original PDF
                </div>
                <div className="shadow-2xl rounded overflow-hidden border border-white/10" style={{ width: pdfDims ? pdfDims.width * scale * 0.8 : "auto" }}>
                    <img ref={imageRef} src={imageUrl} alt="PDF" className="w-full h-auto block" />
                </div>
            </div>

            {/* Right: Editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1117]">
                <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3 bg-[#13151f]">
                    <Columns size={14} className="text-cyan-400" />
                    <span className="text-xs font-bold text-slate-300">Live Text Editor</span>
                    <div className="ml-auto flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block animate-pulse" />
                        Changes apply on save
                    </div>
                </div>
                <div className="px-3 py-2 bg-[#0d0f18] border-b border-white/10">
                    <p className="text-[10px] text-slate-500">
                        ✦ <strong className="text-slate-400">Mode 2 — Split View:</strong> Edit all PDF text freely on the right. The left shows the original PDF reference.
                    </p>
                </div>
                <textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    spellCheck={false}
                    className="flex-1 bg-transparent text-slate-200 text-sm leading-7 font-mono resize-none outline-none p-6 overflow-auto"
                    placeholder="PDF text will load here…"
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODE 3 — Paragraph Block Editing
//  Click on any paragraph on the PDF to open a textarea for that whole block.
// ─────────────────────────────────────────────────────────────────────────────
interface ParagraphModeProps {
    imageUrl: string;
    imageRef: any;
    containerRef: any;
    paragraphs: Paragraph[];
    pdfDims: { width: number; height: number } | null;
    scale: number;
    paraEdits: Record<string, string>;
    setParaEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    activePara: string | null;
    setActivePara: React.Dispatch<React.SetStateAction<string | null>>;
    paraEditVal: string;
    setParaEditVal: React.Dispatch<React.SetStateAction<string>>;
    paraInputRef: any;
}

function ParagraphMode({
    imageUrl, imageRef, containerRef, paragraphs, pdfDims, scale,
    paraEdits, setParaEdits, activePara, setActivePara, paraEditVal, setParaEditVal, paraInputRef,
}: ParagraphModeProps) {
    const confirmPara = () => {
        if (!activePara) return;
        const para = paragraphs.find((p: Paragraph) => p.id === activePara);
        if (paraEditVal.trim() === "" || paraEditVal === para?.fullText) {
            setParaEdits((prev: any) => { const n = { ...prev }; delete n[activePara]; return n; });
        } else {
            setParaEdits((prev: any) => ({ ...prev, [activePara]: paraEditVal }));
        }
        setActivePara(null);
    };

    return (
        <div className="h-full overflow-auto bg-[#0d0f18] flex flex-col items-center py-8 px-4">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlignLeft size={11} /> Mode 3: Click any paragraph to edit it as a whole block
            </div>
            <div
                className="relative shadow-2xl bg-white rounded overflow-hidden border border-white/10"
                ref={containerRef}
                style={{ width: pdfDims ? pdfDims.width * scale : "auto" }}
            >
                <img ref={imageRef} src={imageUrl} alt="PDF" className="block w-full h-auto select-none pointer-events-none" />

                {/* Paragraph overlays */}
                {pdfDims && paragraphs.map((para: Paragraph) => {
                    const isActive = activePara === para.id;
                    const isEdited = paraEdits[para.id] !== undefined;
                    const displayTx = isEdited ? paraEdits[para.id] : para.fullText;

                    return (
                        <div
                            key={para.id}
                            className="absolute"
                            style={{
                                left: (para.x - 4) * scale, top: (para.y - para.fontSize) * scale,
                                width: (para.width + 8) * scale, minHeight: (para.height + para.fontSize) * scale,
                                zIndex: isActive ? 100 : 50,
                            }}
                        >
                            {isActive ? (
                                <div className="relative">
                                    <textarea
                                        ref={paraInputRef}
                                        value={paraEditVal}
                                        onChange={e => setParaEditVal(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Escape") setActivePara(null); }}
                                        onBlur={confirmPara}
                                        className="w-full bg-white/95 border-2 border-violet-500 rounded text-slate-900 outline-none resize-none px-1 py-1 shadow-xl"
                                        style={{
                                            fontSize: para.fontSize * scale,
                                            fontFamily: para.fontName.toLowerCase().includes("serif") ? "serif" : "sans-serif",
                                            lineHeight: 1.5,
                                            minHeight: (para.height + para.fontSize) * scale + 20,
                                        }}
                                    />
                                    <div className="absolute -top-7 right-0 bg-violet-700 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg">
                                        Blur or Esc to confirm
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => { setActivePara(para.id); setParaEditVal(isEdited ? paraEdits[para.id] : para.fullText); }}
                                    className={`w-full h-full cursor-pointer rounded transition-all border ${isEdited
                                        ? "bg-violet-500/20 border-violet-400 shadow-md"
                                        : "border-transparent hover:border-violet-400 hover:bg-violet-400/10"
                                        }`}
                                    title="Click to edit this paragraph"
                                >
                                    {isEdited && (
                                        <div className="absolute inset-0 bg-white/90 rounded flex items-start p-1 overflow-hidden">
                                            <span className="text-violet-700 font-medium leading-snug"
                                                style={{ fontSize: para.fontSize * scale, fontFamily: para.fontName.toLowerCase().includes("serif") ? "serif" : "sans-serif" }}>
                                                {displayTx}
                                            </span>
                                            <button
                                                className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full"
                                                onClick={e => { e.stopPropagation(); setParaEdits((prev: any) => { const n = { ...prev }; delete n[para.id]; return n; }); }}
                                            ><X size={10} /></button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="mt-4 text-[10px] text-slate-600">
                {Object.keys(paraEdits).length} paragraph(s) modified · Hover over paragraph areas to see edit zones
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODE 4 — Overlay Editor
//  A semi-transparent textarea overlaid directly on the PDF image.
// ─────────────────────────────────────────────────────────────────────────────
interface OverlayModeProps {
    imageUrl: string;
    imageRef: any;
    containerRef: any;
    pdfDims: { width: number; height: number } | null;
    scale: number;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    showOverlay: boolean;
    setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

function OverlayMode({
    imageUrl, imageRef, containerRef, pdfDims, scale, value, onChange, showOverlay, setShowOverlay,
}: OverlayModeProps) {
    return (
        <div className="h-full overflow-auto bg-[#0d0f18] flex flex-col items-center py-8 px-4">
            <div className="mb-4 flex items-center gap-3">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Layers size={11} /> Mode 4: Overlay Editor — text editor sits directly on top of the PDF
                </div>
                <button
                    onClick={() => setShowOverlay(!showOverlay)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showOverlay
                        ? "bg-violet-600 border-violet-500 text-white"
                        : "border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                >
                    {showOverlay ? <><Check size={12} /> Editing Active</> : <><Edit3 size={12} /> Enable Overlay Editor</>}
                </button>
            </div>

            <div
                ref={containerRef}
                className="relative shadow-2xl rounded overflow-hidden border border-white/10"
                style={{ width: pdfDims ? pdfDims.width * scale : "auto" }}
            >
                {/* PDF base */}
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="PDF"
                    className={`block w-full h-auto select-none transition-all duration-300 ${showOverlay ? "opacity-25" : "opacity-100"}`}
                />

                {/* Overlay textarea */}
                {showOverlay && (
                    <textarea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        spellCheck={false}
                        className="absolute inset-0 w-full h-full bg-[#fff] text-slate-900 text-sm leading-relaxed font-mono resize-none outline-none px-[5%] py-[3%] overflow-auto"
                        style={{
                            opacity: 0.93,
                            fontSize: pdfDims ? Math.max(11, (pdfDims.width * scale * 0.013)) : 13,
                        }}
                        placeholder="Your PDF text appears here — edit freely…"
                    />
                )}

                {!showOverlay && (
                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={() => setShowOverlay(true)}
                    >
                        <div className="bg-violet-600 hover:bg-violet-500 transition-colors text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl text-sm">
                            <Edit3 size={16} /> Click to Start Editing
                        </div>
                    </div>
                )}
            </div>

            {showOverlay && (
                <p className="mt-3 text-[10px] text-slate-500">
                    Editing directly over the PDF. Click "Enable Overlay Editor" again to preview the original.
                </p>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODE 5 — Line-by-Line (original, improved)
// ─────────────────────────────────────────────────────────────────────────────
interface LineModeProps {
    imageUrl: string;
    imageRef: any;
    containerRef: any;
    lines: TextItem[];
    pdfDims: { width: number; height: number } | null;
    scale: number;
    lineEdits: Record<string, string>;
    setLineEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    activeLineId: string | null;
    setActiveLineId: React.Dispatch<React.SetStateAction<string | null>>;
    lineEditVal: string;
    setLineEditVal: React.Dispatch<React.SetStateAction<string>>;
    lineInputRef: any;
}

function LineMode({
    imageUrl, imageRef, containerRef, lines, pdfDims, scale,
    lineEdits, setLineEdits, activeLineId, setActiveLineId, lineEditVal, setLineEditVal, lineInputRef,
}: LineModeProps) {
    const confirmLine = () => {
        if (!activeLineId) return;
        const idx = parseInt(activeLineId.split("-")[1]);
        const original = lines[idx];
        if (lineEditVal.trim() === "" || lineEditVal === original?.str) {
            setLineEdits((prev: any) => { const n = { ...prev }; delete n[activeLineId]; return n; });
        } else {
            setLineEdits((prev: any) => ({ ...prev, [activeLineId]: lineEditVal }));
        }
        setActiveLineId(null);
    };

    return (
        <div className="h-full overflow-auto bg-[#0d0f18] flex flex-col items-center py-8 px-4">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Edit3 size={11} /> Mode 5: Line-by-line · Click any line on the PDF to edit it
            </div>
            <div
                ref={containerRef}
                className="relative shadow-2xl bg-white rounded overflow-hidden border border-white/10"
                style={{ width: pdfDims ? pdfDims.width * scale : "auto" }}
            >
                <img ref={imageRef} src={imageUrl} alt="PDF" className="block w-full h-auto select-none pointer-events-none" />

                {pdfDims && (
                    <div className="absolute inset-0 z-30">
                        {lines.map((line: TextItem, idx: number) => {
                            const id = `l-${idx}`;
                            const isEdited = lineEdits[id] !== undefined;
                            const isActive = activeLineId === id;
                            const dsText = isEdited ? lineEdits[id] : line.str;

                            return (
                                <div key={id} className="absolute group flex items-center" style={{
                                    left: line.x * scale, top: (line.y - line.fontSize) * scale,
                                    minWidth: line.width * scale, height: line.fontSize * 1.4 * scale,
                                    zIndex: isActive ? 100 : isEdited ? 90 : 80,
                                }}>
                                    {isActive ? (
                                        <div className="relative flex items-center w-full shadow-2xl rounded-sm" style={{ backgroundColor: "white" }}>
                                            <input
                                                ref={lineInputRef}
                                                type="text"
                                                value={lineEditVal}
                                                onChange={e => setLineEditVal(e.target.value)}
                                                onKeyDown={e => { if (e.key === "Enter") confirmLine(); if (e.key === "Escape") setActiveLineId(null); }}
                                                onBlur={confirmLine}
                                                className="w-full bg-transparent border-2 border-violet-500 outline-none rounded-sm text-slate-900 px-1"
                                                style={{ fontSize: line.fontSize * scale, fontFamily: line.fontName?.toLowerCase().includes("serif") ? "serif" : "sans-serif", minWidth: Math.max(line.width * scale + 20, 200) }}
                                            />
                                            <div className="absolute -top-7 right-0 bg-violet-700 text-white text-[9px] font-bold px-2 py-1 rounded shadow pointer-events-none">Enter to save</div>
                                        </div>
                                    ) : isEdited ? (
                                        <div onClick={() => { setActiveLineId(id); setLineEditVal(lineEdits[id]); }} className="relative flex items-center w-full cursor-pointer hover:bg-blue-50/90 px-[2px] rounded-sm" style={{ backgroundColor: "white" }}>
                                            <span className="truncate text-blue-600" style={{ fontSize: line.fontSize * scale, fontFamily: line.fontName?.toLowerCase().includes("serif") ? "serif" : "sans-serif" }}>{dsText}</span>
                                            <button onClick={e => { e.stopPropagation(); setLineEdits((p: any) => { const n = { ...p }; delete n[id]; return n; }); }} className="absolute right-[-22px] opacity-0 group-hover:opacity-100 p-0.5 bg-white text-red-500 rounded-full shadow">
                                                <Undo2 size={11} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div onClick={() => { setActiveLineId(id); setLineEditVal(line.str); }} className="w-full h-full cursor-text border border-transparent hover:border-violet-400 hover:bg-violet-400/10 rounded-sm transition-all" title="Click to edit" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
