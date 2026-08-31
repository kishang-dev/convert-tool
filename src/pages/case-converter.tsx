import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { LuType, LuCopy, LuCheck, LuSlidersHorizontal } from "react-icons/lu";

export default function CaseConverterPage() {
  const [inputText, setInputText] = useState("hello world_example text-string");
  const [activeMode, setActiveMode] = useState<string>("camelCase");
  const [stripAccents, setStripAccents] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const convertCase = (mode: string) => {
    setActiveMode(mode);
    showToast(`Converted to ${mode}!`);
  };

  const getConvertedText = () => {
    let str = inputText;
    if (stripAccents) {
      str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const words = str.split(/[\s_\-\.]+/).filter(Boolean);

    switch (activeMode) {
      case "camelCase":
        return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
      case "PascalCase":
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
      case "snake_case":
        return words.map(w => w.toLowerCase()).join("_");
      case "kebab-case":
        return words.map(w => w.toLowerCase()).join("-");
      case "CONSTANT_CASE":
        return words.map(w => w.toUpperCase()).join("_");
      case "Title Case":
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      case "UPPERCASE":
        return str.toUpperCase();
      case "lowercase":
        return str.toLowerCase();
      case "dot.case":
        return words.map(w => w.toLowerCase()).join(".");
      case "path/case":
        return words.map(w => w.toLowerCase()).join("/");
      default:
        return str;
    }
  };

  const convertedText = getConvertedText();
  const copyText = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    showToast("Converted string copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const byteCount = new Blob([inputText]).size;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO 
        title="String Case Converter - camelCase, PascalCase, snake_case" 
        description="Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and Title Case. Features non-ASCII cleaner and word stats." 
        canonical="/case-converter"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "String Case Converter", href: "/case-converter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuType size={14} /> 10+ String Case Converter & Variable Formatter
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">String Case Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and Title Case.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Input String / Text</label>
              <textarea
                rows={6}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type or paste text string..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl">
                <span>Words: {wordCount}</span>
                <span>Chars: {charCount}</span>
                <span>Bytes: {byteCount}</span>
              </div>

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-blue-500" /> Case Conversion Modes
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "camelCase", "PascalCase", "snake_case",
                    "kebab-case", "CONSTANT_CASE", "Title Case",
                    "UPPERCASE", "lowercase", "dot.case"
                  ].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => convertCase(m)}
                      className={`py-2 rounded-lg text-[11px] font-bold border transition ${activeMode === m ? "border-blue-500 bg-blue-500/10 text-blue-500 font-mono" : "border-[var(--border)]"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-1">
                  <input type="checkbox" checked={stripAccents} onChange={e => setStripAccents(e.target.checked)} className="rounded accent-blue-500" />
                  Strip Diacritics & Accents (e.g. café → cafe)
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Converted Result ({activeMode})</h3>
                  <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-blue-500">
                    {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy String"}
                  </Button>
                </div>

                <textarea
                  rows={10}
                  value={convertedText}
                  readOnly
                  className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="String Case Converter"
          toolDescription="Convert text string cases automatically."
          steps={[
            { name: "Input Text", text: "Enter your text string." },
            { name: "Select Mode", text: "Choose camelCase, snake_case, etc." },
            { name: "Copy", text: "Copy formatted variable string." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
