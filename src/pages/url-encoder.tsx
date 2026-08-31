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
import { LuGlobe, LuCopy, LuCheck, LuArrowLeftRight } from "react-icons/lu";

export default function UrlEncoder() {
  const [inputUrl, setInputUrl] = useState("https://toolbasketai.com/search?q=pdf converter&category=tools#results");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleProcess = async () => {
    if (!inputUrl) return;
    setLoading(true);
    try {
      const res = await devToolsApi.processUrl(inputUrl);
      if (res.result) {
        setResult(res.result);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "URL processing failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    setCopied(label);
    showToast(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="Free URL Encoder & Decoder Online — Percent Encoding & URI Parser"
        description="Encode, decode, and parse web URLs and query parameters online for free. Convert special characters into percent-encoded URI strings and JSON structures."
        canonical="/url-encoder"
        keywords={[
          "url encoder online",
          "url decoder free",
          "percent encoding converter",
          "encode uri component online",
          "parse query parameters json",
          "url string encoder",
          "http url decoder"
        ]}
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "URL Encoder & Parser", href: "/url-encoder" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuGlobe size={14} /> URL Encoder & Parser
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">URL Encoder, Decoder & Parser</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Encode URI component strings, decode percent-encoded URLs, and parse URL query parameters into JSON.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="space-y-6 my-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Input URL / String</label>
            <textarea
              rows={3}
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm font-mono focus:border-amber-500 resize-none mb-4"
              placeholder="Paste URL or string here..."
            />
            <Button onClick={handleProcess} disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl">
              {loading ? "Processing..." : "Process URL"}
            </Button>
          </div>

          {result && (
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm text-amber-500 uppercase tracking-wider">URL Encoded Output</h3>
                  <Button size="sm" variant="ghost" onClick={() => copyText(result.encoded, "Encoded URL")} className="gap-1 text-xs">
                    {copied === "Encoded URL" ? <LuCheck className="text-emerald-500" /> : <LuCopy />} Copy
                  </Button>
                </div>
                <code className="text-xs font-mono break-all text-[var(--text)] block bg-[var(--bg)] p-3 rounded-xl border border-[var(--border)]">
                  {result.encoded}
                </code>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-sm text-amber-500 uppercase tracking-wider">URL Decoded Output</h3>
                  <Button size="sm" variant="ghost" onClick={() => copyText(result.decoded, "Decoded URL")} className="gap-1 text-xs">
                    {copied === "Decoded URL" ? <LuCheck className="text-emerald-500" /> : <LuCopy />} Copy
                  </Button>
                </div>
                <code className="text-xs font-mono break-all text-[var(--text)] block bg-[var(--bg)] p-3 rounded-xl border border-[var(--border)]">
                  {result.decoded}
                </code>
              </div>

              {result.base64Url && (
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm text-amber-500 uppercase tracking-wider">Base64 URL-Safe Output</h3>
                    <Button size="sm" variant="ghost" onClick={() => copyText(result.base64Url, "Base64 URL-Safe")} className="gap-1 text-xs">
                      {copied === "Base64 URL-Safe" ? <LuCheck className="text-emerald-500" /> : <LuCopy />} Copy
                    </Button>
                  </div>
                  <code className="text-xs font-mono break-all text-[var(--text)] block bg-[var(--bg)] p-3 rounded-xl border border-[var(--border)]">
                    {result.base64Url}
                  </code>
                </div>
              )}

              {result.parsed && (
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-sm text-amber-500 uppercase tracking-wider">Parsed URL Breakdown</h3>
                    <a href={inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline font-bold">
                      Open Target Link ↗
                    </a>
                  </div>
                  <pre className="text-xs font-mono bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)] overflow-x-auto text-[var(--text)]">
                    {JSON.stringify(result.parsed, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <ToolSEOContent
          toolName="URL Encoder & Parser"
          toolDescription="Safely encode special URL characters into percent-encoded strings for HTTP requests, or inspect nested URL parameters visually."
          steps={[
            { name: "Paste URL", text: "Paste your target web URL or raw text string." },
            { name: "Process", text: "Click 'Process URL' to run encoding, decoding, and parsing." },
            { name: "Copy", text: "Copy the encoded or decoded outputs for your applications." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
