import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { devToolsApi } from "@/services/api";
import { LuFileCode, LuCopy, LuCheck, LuCode } from "react-icons/lu";

export default function JsonToXml() {
  const [jsonInput, setJsonInput] = useState(`{\n  "user": {\n    "name": "Kishang",\n    "role": "Developer",\n    "skills": ["JavaScript", "TypeScript", "Node.js"]\n  }\n}`);
  const [rootName, setRootName] = useState("root");
  const [indent, setIndent] = useState(2);
  const [xmlResult, setXmlResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConvert = async () => {
    if (!jsonInput.trim()) return;
    setLoading(true);
    try {
      const res = await devToolsApi.jsonToXml(jsonInput, { rootName, indent });
      if (res.result) {
        setXmlResult(res.result);
        showToast("Converted to XML successfully!");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "JSON to XML conversion failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!xmlResult) return;
    navigator.clipboard.writeText(xmlResult);
    setCopied(true);
    showToast("XML copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="JSON to XML Converter — Convert JSON Payloads to XML Online"
        description="Transform JSON objects and arrays into clean XML document markup. Free online JSON to XML converter tool."
        canonical="/json-to-xml"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "JSON to XML Converter", href: "/json-to-xml" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuFileCode size={14} /> Data Converter
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">JSON to XML Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert structured JSON payload strings and arrays into clean, valid XML markup code instantly.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">JSON Input</label>
            </div>
            <textarea
              rows={14}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono focus:border-amber-500 resize-none mb-4"
              placeholder="Paste JSON here..."
            />
            <Button onClick={handleConvert} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl">
              {loading ? "Converting..." : "Convert JSON to XML"}
            </Button>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">XML Result</label>
                {xmlResult && (
                  <Button size="sm" variant="ghost" onClick={copyToClipboard} className="gap-1 text-xs text-amber-500">
                    {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy XML"}
                  </Button>
                )}
              </div>
              {xmlResult ? (
                <pre className="w-full bg-[var(--bg)] border border-[var(--border)] p-4 rounded-xl text-xs font-mono overflow-auto max-h-[360px] text-[var(--text)]">
                  {xmlResult}
                </pre>
              ) : (
                <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                  Click 'Convert JSON to XML' to view formatted XML output.
                </div>
              )}
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="JSON to XML Converter"
          toolDescription="Transform API JSON responses and web services payloads into structured XML format for legacy enterprise systems or SOAP integrations."
          steps={[
            { name: "Paste JSON", text: "Paste your JSON payload into the left editor box." },
            { name: "Convert", text: "Click 'Convert JSON to XML' to run parsing." },
            { name: "Copy XML", text: "View the formatted XML structure and copy it to your clipboard." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
