import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { fileAPI, FileData, conversionApi } from "@/lib/api";
import { LuFileText, LuCloudUpload, LuCopy, LuDownload, LuCheck } from "react-icons/lu";

export default function WordToText() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const response = await fileAPI.uploadFiles([e.target.files[0]]);
      setFile(response.files[0]);
      showToast("Word document uploaded.");
    } catch (err: any) {
      showToast("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await conversionApi.wordToText(file._id);
      setExtractedText(result.text || "");
      setDownloadUrl(result.downloadUrl);
      showToast("Text extracted from Word document!");
    } catch (err: any) {
      showToast("Extraction failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const copyText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    showToast("Extracted text copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Word to Text Converter - Extract Plain Text from DOCX" description="Extract clean unformatted plain text from Microsoft Word .docx documents." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Word to Text Converter", href: "/word-to-text" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFileText size={14} /> DOCX Text Extractor
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Word to Text Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Extract clean plain text from Word (.docx) files instantly.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-blue-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".docx,.doc" onChange={handleFileSelect} className="hidden" id="docx-upload" />
                <label htmlFor="docx-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-blue-500/10 text-blue-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Word Document</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports .docx files</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Ready for extraction</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedText(null); }}>Change</Button>
                </div>

                <Button onClick={handleExtract} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Extracting Text..." : "Extract Plain Text"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Extracted Plain Text</h3>
                  {extractedText && (
                    <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-blue-500">
                      {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>

                {extractedText !== null ? (
                  <textarea
                    rows={10}
                    value={extractedText}
                    readOnly
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)]"
                  />
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-12 text-center text-xs text-[var(--text-muted)]">
                    Upload a Word document and click extract.
                  </div>
                )}
              </div>

              {downloadUrl && (
                <a href={downloadUrl} download className="block w-full mt-4">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                    <LuDownload size={16} /> Download .txt File
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Word to Text Converter"
          toolDescription="Convert Word files into clean plain text for editing and documentation."
          steps={[
            { name: "Upload Word", text: "Select your .docx Word file." },
            { name: "Extract Text", text: "Click 'Extract Plain Text'." },
            { name: "Copy or Download", text: "Copy output text or download as a .txt file." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
