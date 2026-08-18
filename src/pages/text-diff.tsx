import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { devToolsApi } from "@/lib/api";
import { LuArrowLeftRight } from "react-icons/lu";

export default function TextDiff() {
  const [original, setOriginal] = useState("Hello World\nLine 2 text\nLine 3 original");
  const [modified, setModified] = useState("Hello World\nLine 2 modified text\nLine 3 original");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [diffs, setDiffs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await devToolsApi.compareTextDiff(original, modified, { ignoreWhitespace, ignoreCase });
      setDiffs(res.diffs || []);
      showToast("Text difference comparison complete!");
    } catch (err: any) {
      showToast("Comparison failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
    showToast("Original and Modified texts swapped!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Text Difference Checker - Compare Texts Side-by-Side" description="Compare two text passages side-by-side with line diff highlights." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Text Difference Checker", href: "/text-diff" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuArrowLeftRight size={14} /> Text Diff Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Text Difference Checker</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Compare two text passages or code files side-by-side with line-by-line diff highlights.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="space-y-6 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Original Text</label>
              <textarea
                rows={8}
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none focus:border-amber-500 text-[var(--text)]"
              />
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Modified Text</label>
              <textarea
                rows={8}
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none focus:border-amber-500 text-[var(--text)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreWhitespace}
                  onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                Ignore Whitespace
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={ignoreCase}
                  onChange={(e) => setIgnoreCase(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                Ignore Case Sensitivity
              </label>
            </div>
            <Button size="sm" variant="ghost" onClick={handleSwap} className="gap-1.5 text-xs text-amber-500">
              <LuArrowLeftRight size={12} /> Swap Texts
            </Button>
          </div>

          <Button onClick={handleCompare} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl">
            {loading ? "Comparing..." : "Compare Text Difference"}
          </Button>

          {diffs && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <h3 className="font-bold text-lg mb-4">Line Diff Results</h3>
              <div className="space-y-2 font-mono text-xs max-h-[300px] overflow-auto">
                {diffs.map((d, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border flex items-start gap-4 ${
                      d.status === "modified"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600"
                        : d.status === "added"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                        : d.status === "removed"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-600"
                        : "border-[var(--border)] opacity-70"
                    }`}
                  >
                    <span className="font-bold min-w-[30px]">L{d.line}</span>
                    <div className="flex-1 space-y-1">
                      <div><strong className="text-[10px] uppercase tracking-wider opacity-60 mr-2">Orig:</strong>{d.original || "(empty)"}</div>
                      <div><strong className="text-[10px] uppercase tracking-wider opacity-60 mr-2">Mod:</strong>{d.modified || "(empty)"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ToolSEOContent
          toolName="Text Difference Checker"
          toolDescription="Compare text strings and code versions to identify line additions and modifications."
          steps={[
            { name: "Input Original", text: "Paste original text." },
            { name: "Input Modified", text: "Paste modified text." },
            { name: "Compare", text: "View line diff highlights." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
