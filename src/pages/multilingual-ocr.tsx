import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { ocrApi } from "@/lib/api";
import { LuGlobe, LuCloudUpload, LuCopy, LuCheck, LuVolume2, LuDownload, LuLanguages } from "react-icons/lu";

export default function MultilingualOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [secondaryLang, setSecondaryLang] = useState("");
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunOcr = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await ocrApi.multilingual(file, lang, secondaryLang || undefined);
      setExtractedText(result.text || "");
      showToast(`Multilingual OCR (${lang.toUpperCase()}${secondaryLang ? ` + ${secondaryLang.toUpperCase()}` : ""}) complete!`);
    } catch (err: any) {
      showToast("Multilingual OCR failed.", "error");
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

  const playTTS = () => {
    if (!extractedText) return;
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(extractedText);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      showToast("Reading text aloud...");
    } else {
      showToast("Speech synthesis not supported in browser.", "error");
    }
  };

  const exportSrt = () => {
    if (!extractedText) return;
    const lines = extractedText.split("\n").filter(l => l.trim());
    let srt = "";
    lines.forEach((l, i) => {
      const start = `00:00:${String(i * 3).padStart(2, "0")},000`;
      const end = `00:00:${String((i + 1) * 3).padStart(2, "0")},000`;
      srt += `${i + 1}\n${start} --> ${end}\n${l}\n\n`;
    });

    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "multilingual_subtitles.srt";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported multilingual_subtitles.srt");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Multi-Language OCR Engine - 100+ Global Languages & Dual Script" description="Recognize text across 100+ global languages using advanced multi-script OCR. Features dual language combination, TTS playback, and SRT subtitle export." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Multi-Language OCR Engine", href: "/multilingual-ocr" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuGlobe size={14} /> Global Dual-Language OCR & Subtitle Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Multi-Language OCR Engine</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Recognize text in English, Spanish, German, French, Chinese, Japanese, Hindi, Gujarati, and 100+ languages with dual-script support.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-6 space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-pink-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="multi-ocr-upload" />
                <label htmlFor="multi-ocr-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-pink-500/10 text-pink-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Document Image</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports 100+ global languages & dual scripts</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <span className="font-bold text-sm truncate max-w-xs">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setExtractedText(null); }}>Change</Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Primary Language</label>
                    <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-xs outline-none focus:border-pink-500 font-semibold">
                      <option value="eng">English</option>
                      <option value="hin">Hindi (हिन्दी)</option>
                      <option value="guj">Gujarati (ગુજરાતી)</option>
                      <option value="spa">Spanish (Español)</option>
                      <option value="fra">French (Français)</option>
                      <option value="deu">German (Deutsch)</option>
                      <option value="chi_sim">Chinese (中文)</option>
                      <option value="jpn">Japanese (日本語)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Secondary Language</label>
                    <select value={secondaryLang} onChange={(e) => setSecondaryLang(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-xs outline-none focus:border-pink-500 font-semibold">
                      <option value="">None (Single Script)</option>
                      <option value="eng">English</option>
                      <option value="hin">Hindi (हिन्दी)</option>
                      <option value="guj">Gujarati (ગુજરાતી)</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleRunOcr} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Recognizing Multilingual Text..." : "Run Multi-Language OCR"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[350px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <h3 className="font-bold text-lg">Extracted Multilingual Text</h3>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={playTTS} className={`gap-1 text-xs ${isSpeaking ? "text-red-400" : "text-emerald-400"}`}>
                        <LuVolume2 size={14} /> {isSpeaking ? "Stop" : "Listen (TTS)"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={copyText} className="gap-1 text-xs text-pink-500">
                        {copied ? <LuCheck className="text-emerald-500" /> : <LuCopy />} {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={exportSrt} className="gap-1 text-xs text-indigo-400">
                        <LuDownload size={14} /> .SRT
                      </Button>
                    </div>
                  )}
                </div>

                {extractedText !== null ? (
                  <textarea
                    rows={12}
                    value={extractedText}
                    readOnly
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-xs font-mono resize-none text-[var(--text)] leading-relaxed"
                  />
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-16 text-center text-xs text-[var(--text-muted)]">
                    Upload an image and select target language to scan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Multi-Language OCR Engine"
          toolDescription="Scan international documents across 100+ languages."
          steps={[
            { name: "Upload Image", text: "Upload document image." },
            { name: "Select Language", text: "Choose primary and optional secondary languages." },
            { name: "Extract & Listen", text: "Listen to pronunciation or export subtitles (.srt)." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

