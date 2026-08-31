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
import { LuFileOutput, LuDownload, LuCheck, LuSlidersHorizontal } from "react-icons/lu";

export default function TextToWord() {
  const [textInput, setTextInput] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [lineSpacing, setLineSpacing] = useState("1.15");
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConvert = async () => {
    if (!textInput.trim()) return showToast("Please enter text content.", "error");
    setProcessing(true);
    try {
      const result = await conversionApi.textToWord({ text: textInput });
      setDownloadUrl(result.downloadUrl || "#");
      showToast("Text converted to Word document!");
    } catch (err: any) {
      showToast("Conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Text to Word Converter - Generate DOCX from Notes" description="Create formatted Microsoft Word .docx files from plain text notes with typography and line spacing controls." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Text to Word Converter", href: "/text-to-word" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFileOutput size={14} /> DOCX Document Generator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Text to Word Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Generate editable Microsoft Word (.docx) documents from plain text notes with typography controls.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Plain Text Notes</label>
              <textarea
                rows={10}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none focus:border-blue-500 text-[var(--text)]"
                placeholder="Type or paste text content..."
              />

              <div className="p-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <LuSlidersHorizontal size={14} className="text-blue-500" /> Typography & Spacing
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">Font Theme</label>
                    <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 rounded text-xs font-semibold">
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Calibri">Calibri</option>
                      <option value="Inter">Inter</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">Line Spacing</label>
                    <select value={lineSpacing} onChange={e => setLineSpacing(e.target.value)} className="w-full bg-[var(--surface)] border border-[var(--border)] p-2 rounded text-xs font-semibold">
                      <option value="1.0">1.0 (Single)</option>
                      <option value="1.15">1.15 (Standard)</option>
                      <option value="1.5">1.5 (Medium)</option>
                      <option value="2.0">2.0 (Double)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button onClick={handleConvert} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl">
                {processing ? "Generating Word Document..." : "Create DOCX File"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Word Output</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your .docx document download link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">DOCX Created!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download DOCX Document
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Type text notes and click 'Create DOCX File'.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Text to Word Converter"
          toolDescription="Turn raw text input into structured Microsoft Word documents."
          steps={[
            { name: "Input Text", text: "Type or paste text notes." },
            { name: "Generate", text: "Click 'Create DOCX File'." },
            { name: "Download", text: "Download your Word file." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

