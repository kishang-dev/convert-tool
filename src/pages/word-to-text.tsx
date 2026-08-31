import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { conversionApi } from "@/lib/api";
import { LuFileText, LuCloudUpload, LuCopy, LuCheck, LuDownload, LuSearch, LuListOrdered } from "react-icons/lu";

export default function WordToTextPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [extractTables, setExtractTables] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      let combined = "";
      for (const f of files) {
        const uploadRes = await conversionApi.uploadDoc(f);
        const textRes = await conversionApi.wordToText(uploadRes.fileId);
        combined += `--- DOCUMENT: ${f.name} ---\n` + (textRes.text || "") + "\n\n";
      }
      setExtractedText(combined);
      showToast(`Converted ${files.length} Word document(s) successfully!`);
    } catch (err: any) {
      showToast("Word conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    showToast("Extracted text copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (ext: "txt" | "md" | "json") => {
    if (!extractedText) return;
    let content = extractedText;
    let mime = "text/plain";
    if (ext === "json") {
      content = JSON.stringify({ extractedText, totalFiles: files.length, wordCount: extractedText.split(/\s+/).length }, null, 2);
      mime = "application/json";
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted_word_text.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded extracted_word_text.${ext}`);
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).length : 0;
  const paragraphCount = extractedText ? extractedText.split("\n\n").filter(Boolean).length : 0;
  const filteredText = searchKeyword.trim()
    ? extractedText?.split("\n").filter(line => line.toLowerCase().includes(searchKeyword.toLowerCase())).join("\n")
    : extractedText;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Word to Text Converter - Extract Raw Text from DOCX Files" description="Extract plain text from Microsoft Word documents (.docx) in batch. Features table extraction, paragraph counters, and Markdown/TXT/JSON downloads." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Word to Text Converter", href: "/word-to-text" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFileText size={14} /> Batch Word Document Parser & Extractor
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Word to Text Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract raw plain text from single or multiple Microsoft Word (.docx) documents with table extraction and paragraph metrics.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {files.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-blue-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".docx,.doc" multiple onChange={handleFileSelect} className="hidden" id="word-upload" />
                <label htmlFor="word-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Word Files (.docx)</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports batch multi-file uploads</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="font-bold text-sm block">{files.length} file(s) selected</span>
                    <span className="text-xs text-[var(--text-muted)]">{files.map(f => f.name).join(", ").substring(0, 40)}...</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFiles([]); setExtractedText(null); }}>Change</Button>
                </div>

                <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={extractTables} onChange={e => setExtractTables(e.target.checked)} className="rounded accent-blue-500" />
                    Extract embedded tables & headers into Markdown
                  </label>
                </div>

                <Button onClick={handleConvert} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Extracting Text..." : `Convert to Plain Text (${files.length})`}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Extracted Plain Text</h3>
                  {extractedText && (
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-blue-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("txt")} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .TXT
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("md")} className="gap-1 text-xs text-emerald-400">
                        <LuDownload size={14} /> .MD
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => downloadFile("json")} className="gap-1 text-xs text-amber-400">
                        <LuDownload size={14} /> .JSON
                      </Button>
                    </div>
                  )}
                </div>

                {extractedText !== null ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] p-2 rounded-lg">
                      <span>Words: {wordCount}</span>
                      <span>Paragraphs: {paragraphCount}</span>
                    </div>
                    <div className="relative">
                      <LuSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        placeholder="Search keyword inside extracted text..."
                        className="w-full pl-9 pr-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-xs outline-none focus:border-blue-500"
                      />
                    </div>
                    <textarea
                      rows={10}
                      value={filteredText || ""}
                      readOnly
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload Word file(s) and click convert.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Word to Text Converter"
          toolDescription="Convert Microsoft Word documents to raw plain text files."
          steps={[
            { name: "Upload DOCX", text: "Select your Word document." },
            { name: "Convert", text: "Click 'Convert to Plain Text'." },
            { name: "Export", text: "Download as TXT, MD, or JSON." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
