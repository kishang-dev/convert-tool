"use client";

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isSpeechActive?: boolean;
}

export interface RichTextEditorRef {
  insertTextAtCursor: (text: string) => void;
}

// ─── Quill module config (defined once outside component to avoid re-renders) ─
const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
  // Improve keyboard handling
  keyboard: {
    bindings: {},
  },
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "color",
  "background",
];

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value, onChange, placeholder, className = "", isSpeechActive = false }, ref) => {
    const [ReactQuill, setReactQuill] = useState<any>(null);
    const [isReady, setIsReady] = useState(false);
    const quillRef = useRef<any>(null);

    // ── Load Quill only on client ───────────────────────────────────────────
    useEffect(() => {
      let cancelled = false;
      (async () => {
        const { default: QuillComp } = await import("react-quill-new");
        if (!cancelled) {
          setReactQuill(() => QuillComp);
          setIsReady(true);
        }
      })();
      return () => { cancelled = true; };
    }, []);

    // ── Stable helper: get the underlying Quill editor instance ────────────
    const getEditor = useCallback(() => {
      if (!quillRef.current) return null;
      // react-quill-new exposes .getEditor() or .editor
      return quillRef.current.getEditor?.() ?? quillRef.current.editor ?? null;
    }, []);

    // ── Public API exposed via ref ──────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        insertTextAtCursor(text: string) {
          const editor = getEditor();
          if (!editor) {
            // Fallback: append to value directly if Quill not ready
            onChange(value.trim() ? value + text : `<p>${text.trim()}</p>`);
            return;
          }

          // Preserve current selection (or use end of document)
          const range = editor.getSelection(true); // true = focus editor
          const index = range ? range.index : editor.getLength() - 1;

          // Insert with Quill's own API (preserves formatting, undo history)
          editor.insertText(index, text, "user");
          editor.setSelection(index + text.length, 0, "silent");

          // Sync React state — use getSemanticHTML if available, else innerHTML
          const html: string =
            typeof editor.getSemanticHTML === "function"
              ? editor.getSemanticHTML()
              : editor.root.innerHTML;

          onChange(html);
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [getEditor, onChange, value]
    );

    // ── Auto-scroll to bottom during speech ────────────────────────────────
    useEffect(() => {
      if (!isSpeechActive) return;
      // Use requestAnimationFrame so the DOM has updated before we scroll
      const raf = requestAnimationFrame(() => {
        const editorEl = document.querySelector<HTMLElement>(".ql-editor");
        if (editorEl) editorEl.scrollTop = editorEl.scrollHeight;
      });
      return () => cancelAnimationFrame(raf);
    }, [value, isSpeechActive]);

    // ── Loading skeleton ────────────────────────────────────────────────────
    if (!isReady || !ReactQuill) {
      return (
        <div className={`rich-text-editor ${className} flex flex-col flex-1 h-full`}>
          <div className="h-full w-full bg-slate-900/30 animate-pulse rounded-xl border border-slate-700/40 flex items-center justify-center text-slate-600 text-sm">
            Loading editor…
          </div>
        </div>
      );
    }

    return (
      <div
        className={`rich-text-editor ${className} flex flex-col flex-1 overflow-hidden h-full min-h-0`}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={MODULES}
          formats={FORMATS}
          placeholder={placeholder}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        />

        <style jsx global>{`
          /* ── Layout ── */
          .rich-text-editor {
            display: flex;
            flex-direction: column;
          }
          .rich-text-editor .ql-toolbar {
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(10px);
            border-color: #1e293b !important;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            padding: 10px 14px;
            flex-shrink: 0;
          }
          .rich-text-editor .ql-container {
            background: transparent;
            border-color: transparent !important;
            font-family: inherit;
            font-size: 1rem;
            color: #e2e8f0;
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-height: 0;
          }
          .rich-text-editor .ql-editor {
            flex: 1;
            overflow-y: auto !important;
            line-height: 1.75;
            padding: 20px 24px;
            min-height: 0;
            caret-color: #818cf8;
          }
          /* ── Placeholder ── */
          .rich-text-editor .ql-editor.ql-blank::before {
            color: #475569;
            font-style: normal;
            left: 24px;
            pointer-events: none;
          }
          /* ── Typography inside editor ── */
          .rich-text-editor .ql-editor p {
            margin-bottom: 0.875rem;
          }
          .rich-text-editor .ql-editor h1,
          .rich-text-editor .ql-editor h2,
          .rich-text-editor .ql-editor h3 {
            color: #f8fafc !important;
            margin-top: 1.5rem;
            margin-bottom: 0.625rem;
          }
          .rich-text-editor .ql-editor blockquote {
            border-left: 3px solid #4f46e5;
            padding-left: 1rem;
            color: #94a3b8;
          }
          .rich-text-editor .ql-editor a {
            color: #818cf8;
          }
          /* ── Toolbar icons ── */
          .rich-text-editor .ql-stroke {
            stroke: #94a3b8 !important;
            transition: stroke 0.15s;
          }
          .rich-text-editor .ql-fill {
            fill: #94a3b8 !important;
            transition: fill 0.15s;
          }
          .rich-text-editor .ql-picker {
            color: #94a3b8 !important;
          }
          .rich-text-editor button:hover .ql-stroke,
          .rich-text-editor .ql-active .ql-stroke {
            stroke: #a5b4fc !important;
          }
          .rich-text-editor button:hover .ql-fill,
          .rich-text-editor .ql-active .ql-fill {
            fill: #a5b4fc !important;
          }
          /* ── Toolbar dropdowns ── */
          .rich-text-editor .ql-picker-label {
            border-color: transparent !important;
            padding: 0 18px 0 4px;
          }
          .rich-text-editor .ql-picker-label:hover {
            color: #e2e8f0 !important;
          }
          .rich-text-editor .ql-picker-options {
            background-color: #0f172a !important;
            border-color: #1e293b !important;
            border-radius: 10px;
            padding: 6px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          }
          .rich-text-editor .ql-picker-item:hover {
            color: #a5b4fc !important;
          }
          /* ── Tooltip (links) ── */
          .rich-text-editor .ql-tooltip {
            background: #0f172a !important;
            border-color: #1e293b !important;
            color: #e2e8f0 !important;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          }
          .rich-text-editor .ql-tooltip input[type="text"] {
            background: #1e293b !important;
            border-color: #334155 !important;
            color: #e2e8f0 !important;
            border-radius: 6px;
          }
          .rich-text-editor .ql-action,
          .rich-text-editor .ql-remove {
            color: #818cf8 !important;
          }
          /* ── Scrollbar ── */
          .rich-text-editor .ql-editor::-webkit-scrollbar { width: 5px; }
          .rich-text-editor .ql-editor::-webkit-scrollbar-track { background: transparent; }
          .rich-text-editor .ql-editor::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 99px;
          }
          .rich-text-editor .ql-editor::-webkit-scrollbar-thumb:hover {
            background: #334155;
          }
          /* ── Speech-active pulse on the editor border ── */
          .rich-text-editor.speech-active .ql-container {
            border-color: rgba(99, 102, 241, 0.3) !important;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;