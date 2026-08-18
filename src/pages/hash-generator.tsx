import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { devToolsApi } from "@/services/api";
import { LuKey, LuCopy, LuCheck, LuRefreshCw } from "react-icons/lu";

export default function HashGenerator() {
  const [inputText, setInputText] = useState("ToolBasketAI");
  const [secretKey, setSecretKey] = useState("");
  const [isUppercase, setIsUppercase] = useState(false);
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string; sha512: string; uuid: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await devToolsApi.generateHashes(inputText, { secretKey, isUppercase });
      if (res.result) {
        setHashes(res.result);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Hash generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [inputText, secretKey, isUppercase]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="UUID & Hash Generator — MD5, SHA-256, SHA-512, UUID v4 Online"
        description="Generate MD5, SHA-1, SHA-256, SHA-512 hashes, and UUID v4 keys instantly online for developer & security workflows."
        canonical="/hash-generator"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "UUID & Hash Generator", href: "/hash-generator" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 font-semibold text-xs mb-4">
            <LuKey size={14} /> Hash & UUID Generator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">UUID & Cryptographic Hash Generator</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Compute real-time MD5, SHA-1, SHA-256, SHA-512 cryptographic hashes and generate unique random UUID v4 strings.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="space-y-6 my-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Input String</label>
              <Button size="sm" variant="ghost" onClick={handleGenerate} className="gap-1.5 text-xs text-amber-500">
                <LuRefreshCw size={12} className={loading ? "animate-spin" : ""} /> Regenerate
              </Button>
            </div>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm font-mono focus:border-amber-500 resize-none"
              placeholder="Enter text to hash..."
            />
          </div>

          {hashes && (
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "UUID v4", value: hashes.uuid },
                { label: "MD5 Hash", value: hashes.md5 },
                { label: "SHA-1 Hash", value: hashes.sha1 },
                { label: "SHA-256 Hash", value: hashes.sha256 },
                { label: "SHA-512 Hash", value: hashes.sha512 },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="overflow-hidden pr-2">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-0.5">{item.label}</span>
                    <code className="text-xs font-mono break-all text-[var(--text)]">{item.value}</code>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.value, item.label)}
                    className="shrink-0 gap-1.5 text-xs border border-[var(--border)]"
                  >
                    {copiedKey === item.label ? <LuCheck className="text-emerald-500" size={14} /> : <LuCopy size={14} />}
                    {copiedKey === item.label ? "Copied" : "Copy"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <ToolSEOContent
          toolName="UUID & Hash Generator"
          toolDescription="Generate secure unique identifiers and cryptographic hash checksums for software development, database keys, and data integrity verification."
          steps={[
            { name: "Enter Text", text: "Enter any plain text or payload string into the input area." },
            { name: "Generate", text: "Hashes are automatically computed for MD5, SHA1, SHA256, and SHA512." },
            { name: "Copy", text: "Click 'Copy' next to any output string to copy it to your clipboard." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
