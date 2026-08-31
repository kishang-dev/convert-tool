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
import { LuCode, LuDownload, LuCheck, LuEye, LuSlidersHorizontal } from "react-icons/lu";

export default function HtmlToWordPage() {
  const [htmlInput, setHtmlInput] = useState("<h1>Sample Title</h1>\n<p>This is a <strong>formatted HTML</strong> paragraph with <span style='color:blue;'>inline styles</span>.</p>");
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [preserveStyles, setPreserveStyles] = useState(true);
  const [embedImages, setEmbedImages] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConvert = async () => {
    if (!htmlInput.trim()) return;
    setProcessing(true);
    try {
      const res = await conversionApi.htmlToWord({ html: htmlInput });
      setDownloadUrl(res.downloadUrl || "#");
      showToast("HTML converted to Word document!");
    } catch (err: any) {
      showToast("HTML to Word conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="HTML to Word Converter - Convert HTML to DOCX" description="Convert web HTML markup into formatted Microsoft Word (.docx) documents. Features inline CSS preservation, external image embedding, and live split view." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "HTML to Word Converter", href: "/html-to-word" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuCode size={14} /> Rich HTML to DOCX Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">HTML to Word Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert HTML markup, styled web pages, and rich text tables into editable Microsoft Word (.docx) documents.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("code")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "code" ? "bg-blue-600 text-white" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                  >
                    HTML Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === "preview" ? "bg-blue-600 text-white" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                  >
                    Visual Preview
                  </button>
                </div>
              </div>

              {activeTab === "code" ? (
                <textarea
                  rows={10}
                  value={htmlInput}
                  onChange={e => setHtmlInput(e.target.value)}
                  placeholder="Paste HTML code here..."
                  className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono text-[var(--text)]"
                />
              ) : (
                <div
                  className="w-full min-h-[220px] max-h-[260px] overflow-auto bg-white text-black p-4 rounded-xl text-xs border border-[var(--border)]"
                  dangerouslySetInnerHTML={{ __html: htmlInput }}
                />
              )}

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-blue-500" /> Conversion Controls
                </h4>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={preserveStyles} onChange={e => setPreserveStyles(e.target.checked)} className="rounded accent-blue-500" />
                  Preserve Inline CSS Colors & Formatting
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input type="checkbox" checked={embedImages} onChange={e => setEmbedImages(e.target.checked)} className="rounded accent-blue-500" />
                  Embed External Image URLs into Word
                </label>
              </div>

              <Button onClick={handleConvert} disabled={processing || !htmlInput.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl">
                {processing ? "Converting HTML..." : "Convert to Word (.docx)"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Word Output</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your converted Microsoft Word document download link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-center space-y-3">
                    <div className="p-4 bg-blue-500/20 text-blue-500 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
                      <LuCode size={28} />
                    </div>
                    <h4 className="font-extrabold text-base text-blue-500">HTML Converted to Word!</h4>
                    <a href={downloadUrl} download className="block w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl gap-2">
                        <LuDownload size={16} /> Download .DOCX Document
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Paste HTML code and click convert.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="HTML to Word Converter"
          toolDescription="Convert web HTML code into Word documents."
          steps={[
            { name: "Input HTML", text: "Paste HTML code or preview markup." },
            { name: "Convert", text: "Click 'Convert to Word'." },
            { name: "Download", text: "Download your .docx document." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
