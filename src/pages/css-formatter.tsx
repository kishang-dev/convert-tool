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

export default function CssFormatterPage() {
  const [inputCode, setInputCode] = useState(".card { background: #ffffff; color: rgb(0,0,0); font-size: 14px; margin: 0; padding: 10px; }");
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [sortProperties, setSortProperties] = useState(true);
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
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s*([\{\}:;,])\s*/g, "$1")
        .replace(/;\}/g, "}")
        .trim();
      setFormattedCode(minified);
      showToast("CSS minified successfully!");
      return;
    }

    // Beautify CSS
    let clean = inputCode.replace(/\s*([\{\}:;,])\s*/g, "$1");
    let rules = clean.split("}");
    let formatted = rules.map(rule => {
      if (!rule.trim()) return "";
      let [selector, body] = rule.split("{");
      if (!body) return selector.trim();

      let props = body.split(";").filter(Boolean);
      if (sortProperties) props.sort();
      let bodyFormatted = props.map(p => `  ${p.trim()};`).join("\n");
      return `${selector.trim()} {\n${bodyFormatted}\n}`;
    }).filter(Boolean).join("\n\n");

    setFormattedCode(formatted);
    showToast("CSS beautified successfully!");
  };

  const copyCode = () => {
    if (!formattedCode) return;
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    showToast("Formatted CSS copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCss = () => {
    if (!formattedCode) return;
    const blob = new Blob([formattedCode], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "styles.css";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded styles.css");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="CSS Formatter & Beautifier - Format & Minify CSS" description="Beautify CSS stylesheets, sort properties alphabetically, optimize layout code, and minify production CSS." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "CSS Formatter & Beautifier", href: "/css-formatter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold text-xs mb-4">
            <LuCode size={14} /> CSS Beautifier & Property Organizer
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">CSS Formatter & Beautifier</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Beautify CSS stylesheets, sort properties alphabetically, optimize rules, and compress production CSS.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Raw CSS Stylesheet</label>
              <textarea
                rows={10}
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Paste CSS code here..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-indigo-500" /> CSS Rules Options
                </h4>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={sortProperties} onChange={e => setSortProperties(e.target.checked)} className="rounded accent-indigo-500" />
                  Sort CSS Properties Alphabetically
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleFormat(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl gap-2">
                  <LuMaximize2 size={14} /> Beautify CSS
                </Button>
                <Button onClick={() => handleFormat(true)} variant="secondary" className="w-full py-3.5 rounded-xl font-bold gap-2">
                  <LuMinimize2 size={14} /> Minify CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Formatted CSS Output</h3>
                  {formattedCode && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={copyCode} className="gap-1 text-xs text-indigo-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={downloadCss} className="gap-1 text-xs text-emerald-400">
                        <LuDownload size={14} /> .CSS
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
                    Paste CSS code and click Beautify or Minify.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="CSS Formatter & Beautifier"
          toolDescription="Beautify and optimize CSS code."
          steps={[
            { name: "Paste CSS", text: "Input raw CSS stylesheet." },
            { name: "Format", text: "Click 'Beautify CSS' or 'Minify CSS'." },
            { name: "Copy", text: "Copy formatted stylesheet." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
