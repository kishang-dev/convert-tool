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
import { LuBraces, LuCopy, LuCheck } from "react-icons/lu";

export default function CaseConverter() {
  const [inputText, setInputText] = useState("hello world text converter");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConvert = async () => {
    if (!inputText.trim()) return showToast("Enter text input.", "error");
    setLoading(true);
    try {
      const res = await devToolsApi.convertCase(inputText);
      setResults(res.result);
      showToast("Case converted!");
    } catch (err: any) {
      showToast("Conversion failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    showToast(`Copied ${key}!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const breadcrumbs = [{ name: "String Case Converter", item: "/case-converter" }];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="Free String Case Converter — camelCase, snake_case, PascalCase & Kebab"
        description="Convert string case between camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, and lowercase. Free online developer text case converter."
        canonical="/case-converter"
        keywords="case converter, camelcase converter, snake_case converter, kebab-case converter, pascalcase converter, text case converter online"
        breadcrumbs={breadcrumbs}
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "String Case Converter", href: "/case-converter" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuBraces size={14} /> String Case Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">String Case Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert text strings between camelCase, PascalCase, snake_case, kebab-case, and UPPERCASE.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="space-y-6 my-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Text String Input</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-amber-500 font-mono"
              placeholder="e.g. user profile avatar photo"
            />
            <Button onClick={handleConvert} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl">
              {loading ? "Converting Cases..." : "Convert String Cases"}
            </Button>
          </div>

          {results && (
            <div className="space-y-6">
              {results.stats && (
                <div className="grid grid-cols-3 gap-4 text-center p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block">Characters</span>
                    <span className="text-sm font-extrabold text-amber-500 font-mono">{results.stats.charCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block">Words</span>
                    <span className="text-sm font-extrabold text-amber-500 font-mono">{results.stats.wordCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase block">Lines</span>
                    <span className="text-sm font-extrabold text-amber-500 font-mono">{results.stats.lineCount}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "camelCase", key: "camelCase", val: results.camelCase },
                  { label: "PascalCase", key: "PascalCase", val: results.pascalCase },
                  { label: "snake_case", key: "snake_case", val: results.snakeCase },
                  { label: "kebab-case", key: "kebab-case", val: results.kebabCase },
                  { label: "CONSTANT_CASE", key: "constantCase", val: results.constantCase },
                  { label: "Title Case", key: "titleCase", val: results.titleCase },
                  { label: "Sentence case", key: "sentenceCase", val: results.sentenceCase },
                  { label: "UPPERCASE", key: "upperCase", val: results.upperCase },
                  { label: "lowercase", key: "lowerCase", val: results.lowerCase },
                  { label: "tOGGLE cASE", key: "toggleCase", val: results.toggleCase },
                  { label: "dot.case", key: "dotCase", val: results.dotCase },
                ].filter(item => item.val).map((item) => (
                  <div key={item.key} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-0.5">{item.label}</span>
                      <code className="text-xs font-mono text-[var(--text)] break-all">{item.val}</code>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => copyVal(item.val, item.label)} className="gap-1 text-xs shrink-0">
                      {copiedKey === item.label ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copiedKey === item.label ? "Copied" : "Copy"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ToolSEOContent
          toolName="String Case Converter"
          toolDescription="Convert text variables into developer naming conventions."
          steps={[
            { name: "Input String", text: "Enter your text phrase." },
            { name: "Convert", text: "Click 'Convert String Cases'." },
            { name: "Copy", text: "Copy any casing format to clipboard." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
