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
import { LuCode, LuCopy, LuCheck } from "react-icons/lu";

export default function CssFormatter() {
  const [inputCode, setInputCode] = useState(".card{background:#fff;color:#000;border:1px solid #ccc}");
  const [outputCode, setOutputCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormat = async () => {
    if (!inputCode.trim()) return showToast("Enter CSS code.", "error");
    setLoading(true);
    try {
      const result = await devToolsApi.formatCss(inputCode);
      setOutputCode(result.result);
      showToast("CSS formatted!");
    } catch (err: any) {
      showToast("Formatting failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    showToast("Formatted CSS copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="CSS Formatter & Beautifier - Format Stylesheet Code" description="Beautify, format, and indent stylesheet CSS code." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "CSS Formatter", href: "/css-formatter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuCode size={14} /> CSS Beautifier
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">CSS Formatter & Beautifier</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Beautify and format minified CSS code blocks with proper line indentations.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">CSS Input</label>
            <textarea
              rows={12}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none focus:border-amber-500 text-[var(--text)]"
              placeholder="Paste CSS code here..."
            />
            <Button onClick={handleFormat} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl">
              {loading ? "Formatting..." : "Format CSS"}
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Formatted CSS</label>
                {outputCode && (
                  <Button size="sm" variant="ghost" onClick={copyCode} className="gap-1 text-xs text-amber-500">
                    {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy CSS"}
                  </Button>
                )}
              </div>

              {outputCode !== null ? (
                <pre className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-xs font-mono overflow-auto max-h-[300px] text-[var(--text)]">
                  {outputCode}
                </pre>
              ) : (
                <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                  Click 'Format CSS' to view indented output.
                </div>
              )}
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="CSS Formatter"
          toolDescription="Format and beautify stylesheet CSS rules."
          steps={[
            { name: "Paste CSS", text: "Paste raw CSS rules." },
            { name: "Format", text: "Click 'Format CSS'." },
            { name: "Copy", text: "Copy the formatted CSS output." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
