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

export default function HtmlFormatterPage() {
  const [inputCode, setInputCode] = useState('<div className="container" id="main"><header><h1>Title</h1></header><script>alert("xss")</script><p>Paragraph text</p></div>');
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [indentWidth, setIndentWidth] = useState<number>(2);
  const [sanitizeXss, setSanitizeXss] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormat = (minify = false) => {
    if (!inputCode.trim()) return;
    let code = inputCode;

    // Optional XSS Sanitizer
    if (sanitizeXss) {
      code = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                 .replace(/\s*on\w+="[^"]*"/gi, "");
    }

    if (minify) {
      setFormattedCode(code.replace(/>\s+</g, "><").trim());
      showToast("HTML minified successfully!");
      return;
    }

    // Basic Pretty Print Formatter with custom indent
    const indentStr = " ".repeat(indentWidth);
    let formatted = "";
    let pad = 0;
    const tokens = code.replace(/>\s+</g, "><").split(/(?=<)|(?<=>)/);

    tokens.forEach(token => {
      if (!token) return;
      if (token.match(/^<\/\w/)) pad = Math.max(0, pad - 1);
      formatted += indentStr.repeat(pad) + token.trim() + "\n";
      if (token.match(/^<\w[^>]*[^\/]>$/) && !token.match(/^<(input|img|br|hr|link|meta)/i)) pad++;
    });

    setFormattedCode(formatted.trim());
    showToast("HTML beautified successfully!");
  };

  const copyCode = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    showToast("Formatted HTML copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    if (!formattedCode) return;
    const blob = new Blob([formattedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted_code.html";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded formatted_code.html");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="HTML Formatter & Sanitizer - Beautify & Minify HTML" description="Pretty print HTML code, fix tag indentation, sanitize XSS scripts, and minify HTML markup. Custom 2/4 space indent options." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "HTML Formatter & Sanitizer", href: "/html-formatter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuCode size={14} /> HTML Code Beautifier & Security Sanitizer
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">HTML Formatter & Sanitizer</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Format messy HTML markup, auto-fix tag indentation, sanitize dangerous XSS scripts, and toggle minifier mode.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Raw HTML Snippet</label>
              <textarea
                rows={10}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Paste raw or minified HTML here..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-blue-500" /> Formatter Settings
                </h4>
                <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <span>Indent Spacing:</span>
                  <div className="flex gap-2">
                    {[2, 4].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setIndentWidth(w)}
                        className={`px-3 py-1 rounded border text-xs font-mono transition ${indentWidth === w ? "border-blue-500 bg-blue-500/10 text-blue-500 font-bold" : "border-[var(--border)]"}`}
                      >
                        {w} Spaces
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={sanitizeXss} onChange={e => setSanitizeXss(e.target.checked)} className="rounded accent-blue-500" />
                  Sanitize & Strip &lt;script&gt; tags (XSS Prevention)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleFormat(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl gap-2">
                  <LuMaximize2 size={14} /> Beautify HTML
                </Button>
                <Button onClick={() => handleFormat(true)} variant="secondary" className="w-full py-3.5 rounded-xl font-bold gap-2">
                  <LuMinimize2 size={14} /> Minify HTML
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Formatted HTML Output</h3>
                  {formattedCode && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyCode} className="gap-1 text-xs text-blue-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={downloadHtml} className="gap-1 text-xs text-emerald-400">
                        <LuDownload size={14} /> .HTML
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
                    Paste HTML code and click Beautify or Minify.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="HTML Formatter & Sanitizer"
          toolDescription="Beautify, sanitize, and minify HTML markup."
          steps={[
            { name: "Paste HTML", text: "Input messy HTML code." },
            { name: "Format", text: "Click 'Beautify HTML' or 'Minify HTML'." },
            { name: "Copy", text: "Copy or download clean HTML." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
