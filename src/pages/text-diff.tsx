import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { LuFileDiff, LuDownload } from "react-icons/lu";

export default function TextDiffPage() {
  const [originalText, setOriginalText] = useState("const name = 'John';\nconst age = 30;");
  const [changedText, setChangedText] = useState("const name = 'Jane';\nconst age = 31;\nconst role = 'Admin';");
  const [diffView, setDiffView] = useState<"side-by-side" | "unified">("side-by-side");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [diffResult, setDiffResult] = useState<any[] | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCompare = () => {
    const origLines = originalText.split("\n");
    const newLines = changedText.split("\n");
    const diffs: any[] = [];

    const max = Math.max(origLines.length, newLines.length);
    for (let i = 0; i < max; i++) {
      const l1 = origLines[i] || "";
      const l2 = newLines[i] || "";

      let line1 = l1;
      let line2 = l2;
      if (ignoreWhitespace) {
        line1 = line1.trim();
        line2 = line2.trim();
      }

      if (line1 === line2) {
        diffs.push({ type: "same", line1: l1, line2: l2, num: i + 1 });
      } else {
        diffs.push({ type: "diff", line1: l1, line2: l2, num: i + 1 });
      }
    }

    setDiffResult(diffs);
    showToast("Diff comparison generated!");
  };

  const downloadPatch = () => {
    if (!diffResult) return;
    let patch = `--- Original\n+++ Modified\n@@ -1,${originalText.split("\n").length} +1,${changedText.split("\n").length} @@\n`;
    diffResult.forEach(d => {
      if (d.type === "same") patch += ` ${d.line1}\n`;
      else {
        if (d.line1) patch += `-${d.line1}\n`;
        if (d.line2) patch += `+${d.line2}\n`;
      }
    });

    const blob = new Blob([patch], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text_changes.patch";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded text_changes.patch");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Text Difference Checker - Side-by-Side Code Diff" description="Compare two text blocks or code files side-by-side with exact line and character level diffs. Export patch reports and ignore whitespace options." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Text Difference Checker", href: "/text-diff" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFileDiff size={14} /> Text & Code Line-by-Line Diff Inspector
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Text Difference Checker</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Compare two text blocks or code snippets side-by-side with exact line diff highlights and patch export.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="space-y-6 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Original Text / File 1</label>
              <textarea
                rows={8}
                value={originalText}
                onChange={e => setOriginalText(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Modified Text / File 2</label>
              <textarea
                rows={8}
                value={changedText}
                onChange={e => setChangedText(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />
            </div>
          </div>

          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDiffView("side-by-side")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${diffView === "side-by-side" ? "bg-blue-600 text-white" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                >
                  Side-by-Side
                </button>
                <button
                  type="button"
                  onClick={() => setDiffView("unified")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${diffView === "unified" ? "bg-blue-600 text-white" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                >
                  Unified Stream
                </button>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input type="checkbox" checked={ignoreWhitespace} onChange={e => setIgnoreWhitespace(e.target.checked)} className="rounded accent-blue-500" />
                Ignore Trailing Whitespace
              </label>
            </div>

            <Button onClick={handleCompare} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl">
              Compare Differences
            </Button>
          </div>

          {diffResult && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Diff Comparison View</h3>
                <Button size="sm" variant="ghost" onClick={downloadPatch} className="gap-1 text-xs text-indigo-400">
                  <LuDownload size={14} /> Download .PATCH
                </Button>
              </div>

              <div className="border border-[var(--border)] rounded-xl overflow-hidden font-mono text-xs max-h-96 overflow-y-auto">
                {diffResult.map((item, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 border-b border-[var(--border)] p-2 ${item.type === "diff" ? "bg-amber-500/10" : "bg-[var(--bg)]"}`}
                  >
                    <span className="col-span-1 text-[10px] text-[var(--text-muted)] font-bold">L{item.num}</span>
                    {diffView === "side-by-side" ? (
                      <>
                        <div className={`col-span-5 border-r border-[var(--border)] pr-2 ${item.type === "diff" ? "text-red-400 bg-red-500/10" : ""}`}>
                          {item.line1 || <span className="opacity-30">&empty;</span>}
                        </div>
                        <div className={`col-span-6 pl-2 ${item.type === "diff" ? "text-emerald-400 bg-emerald-500/10" : ""}`}>
                          {item.line2 || <span className="opacity-30">&empty;</span>}
                        </div>
                      </>
                    ) : (
                      <div className="col-span-11 space-y-1">
                        {item.line1 && <div className="text-red-400">- {item.line1}</div>}
                        {item.line2 && <div className="text-emerald-400">+ {item.line2}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ToolSEOContent
          toolName="Text Difference Checker"
          toolDescription="Compare text blocks side-by-side."
          steps={[
            { name: "Input Text", text: "Paste original and modified text." },
            { name: "Compare", text: "Click 'Compare Differences'." },
            { name: "Export Patch", text: "Download .patch file." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
