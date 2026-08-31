import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { LuCode, LuCopy, LuCheck, LuDownload, LuSlidersHorizontal, LuMaximize2, LuMinimize2 } from "react-icons/lu";

export default function JsFormatterPage() {
  const [inputCode, setInputCode] = useState('function calculateTotal(items){return items.reduce((acc,item)=>acc+item.price,0);}');
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [useSingleQuotes, setUseSingleQuotes] = useState(true);
  const [addSemicolons, setAddSemicolons] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormat = (minify = false) => {
    if (!inputCode.trim()) return;

    if (minify) {
      const minified = inputCode
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
        .replace(/\s*([\{\}\(\);=,\+\-\*\/])\s*/g, "$1")
        .trim();
      setFormattedCode(minified);
      showToast("JS minified successfully!");
      return;
    }

    // Basic JS/TS Beautifier
    let code = inputCode;
    if (useSingleQuotes) {
      code = code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'");
    }

    let indent = 0;
    let formatted = "";
    const lines = code.split(/(?<=[\{\};])/);

    lines.forEach(line => {
      let trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith("}")) indent = Math.max(0, indent - 1);
      formatted += "  ".repeat(indent) + trimmed + "\n";
      if (trimmed.endsWith("{")) indent++;
    });

    setFormattedCode(formatted.trim());
    showToast("JS/TS code beautified!");
  };

  const copyCode = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    showToast("Formatted code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJs = () => {
    if (!formattedCode) return;
    const blob = new Blob([formattedCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_code.js";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded formatted_code.js");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="JS/TS Formatter & Beautifier - Format JavaScript & TypeScript Code" description="Format JavaScript and TypeScript code snippets automatically. Features ES6+ beautifier, quote/semicolon standardizer, and JS minifier." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "JS/TS Formatter", href: "/js-formatter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuCode size={14} /> JS / TS ES6+ Beautifier & Standardizer
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">JS/TS Formatter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Format JavaScript and TypeScript code snippets automatically with quote standardization and minifier controls.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Raw JS / TS Code</label>
              <textarea
                rows={10}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Paste JavaScript or TypeScript code here..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-amber-500" /> Syntax Standardization
                </h4>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={useSingleQuotes} onChange={e => setUseSingleQuotes(e.target.checked)} className="rounded accent-amber-500" />
                  Convert String Quotes to Single Quotes (')
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={addSemicolons} onChange={e => setAddSemicolons(e.target.checked)} className="rounded accent-amber-500" />
                  Enforce Trailing Semicolons (;)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleFormat(false)} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl gap-2">
                  <LuMaximize2 size={14} /> Beautify JS/TS
                </Button>
                <Button onClick={() => handleFormat(true)} variant="secondary" className="w-full py-3.5 rounded-xl font-bold gap-2">
                  <LuMinimize2 size={14} /> Minify JS Code
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Formatted JS/TS Output</h3>
                  {formattedCode && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyCode} className="gap-1 text-xs text-amber-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={downloadJs} className="gap-1 text-xs text-emerald-400">
                        <LuDownload size={14} /> .JS
                      </Button>
                    </div>
                  )}
                </div>

                {formattedCode !== null ? (
                  <textarea
                    rows={12}
                    value={formattedCode}
                    readOnly
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                  />
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Paste JavaScript code and click Beautify or Minify.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="JS/TS Formatter"
          toolDescription="Format JavaScript and TypeScript code snippets."
          steps={[
            { name: "Paste Code", text: "Input raw JS/TS code." },
            { name: "Format", text: "Click 'Beautify JS/TS' or 'Minify'." },
            { name: "Copy", text: "Copy formatted script." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
