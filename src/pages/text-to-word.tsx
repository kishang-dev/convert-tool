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
import { LuFileOutput, LuDownload, LuCheck } from "react-icons/lu";

export default function TextToWord() {
  const [textInput, setTextInput] = useState("Type or paste your text notes here...");
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
      setDownloadUrl(result.downloadUrl);
      showToast("Text converted to Word document!");
    } catch (err: any) {
      showToast("Conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Text to Word Converter - Generate DOCX from Notes" description="Create formatted Microsoft Word .docx files from plain text notes." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Text to Word Converter", href: "/text-to-word" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFileOutput size={14} /> DOCX Document Generator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Text to Word Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Generate editable Microsoft Word (.docx) documents from plain text notes or snippets.
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
