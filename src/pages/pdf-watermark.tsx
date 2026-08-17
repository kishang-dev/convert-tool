import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import PdfUploadDropzone from "@/components/PdfUploadDropzone";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { fileAPI, FileData } from "@/lib/api";
import { pdfToolsApi } from "@/services/api";
import { LuFileText, LuDownload, LuPenLine, LuRotateCcw, LuCheck } from "react-icons/lu";

export default function PdfWatermark() {
  const [file, setFile] = useState<FileData | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState("#888888");

  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      showToast("Please upload a valid PDF document", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await fileAPI.uploadFiles([selected]);
      if (res.files && res.files.length > 0) {
        setFile(res.files[0]);
        setDownloadUrl(null);
        showToast("PDF uploaded successfully.");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyWatermark = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const res = await pdfToolsApi.watermark(file._id, {
        text: watermarkText,
        opacity,
        size: fontSize,
        rotation,
        color,
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const fullUrl = res.downloadUrl.startsWith("http") ? res.downloadUrl : `${API_URL}${res.downloadUrl}`;
      setDownloadUrl(fullUrl);
      showToast("Watermark applied successfully!");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to apply watermark", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="PDF Watermark Tool — Add Custom Watermark to PDF Free"
        description="Add custom text watermarks to your PDF pages online. Customize text, font size, opacity, rotation, and color with ease."
        canonical="/pdf-watermark"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Watermark", href: "/pdf-watermark" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuPenLine size={14} /> PDF Watermark Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Add Custom Watermark to PDF</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Protect your intellectual property or label your document by adding custom text watermarks to every PDF page.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <PdfUploadDropzone onFilesSelected={handleFileSelect} loading={uploading} title="Upload PDF File" />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)]">Ready for watermarking</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-pink-500"
                      placeholder="e.g. CONFIDENTIAL / DRAFT"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Font Size ({fontSize}px)</label>
                      <input
                        type="range" min="16" max="96" value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
                      <input
                        type="range" min="0.05" max="1" step="0.05" value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Rotation ({rotation}°)</label>
                      <input
                        type="range" min="-90" max="90" value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Text Color</label>
                      <input
                        type="color" value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-10 bg-transparent border border-[var(--border)] rounded-xl cursor-pointer p-1"
                      />
                    </div>
                  </div>

                  <Button onClick={handleApplyWatermark} disabled={processing || !watermarkText} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl mt-4">
                    {processing ? "Applying Watermark..." : "Apply Watermark"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <h3 className="font-bold text-lg mb-2">Live Status</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your watermarked file will be generated below once applied.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-fadeIn">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">PDF Watermarked!</h4>
                    <p className="text-xs text-[var(--text-muted)] mb-4">Your output PDF is ready for immediate download.</p>
                    <a href={downloadUrl} download className="inline-block w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Watermarked PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a PDF and click "Apply Watermark" to download the watermarked document.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Watermark Tool"
          toolDescription="Protect your sensitive PDFs by adding custom watermarks directly in your browser. Choose custom text, opacity level, font sizing, and text rotation."
          steps={[
            { name: "Upload PDF", text: "Upload your PDF document into the upload zone." },
            { name: "Configure Settings", text: "Customize the watermark text, font size, opacity level, rotation, and color." },
            { name: "Apply & Download", text: "Click 'Apply Watermark' to process all pages and download your document." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
