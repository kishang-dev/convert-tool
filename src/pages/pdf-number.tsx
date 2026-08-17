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
import { LuFileText, LuDownload, LuFilePlus, LuCheck } from "react-icons/lu";

export default function PdfNumber() {
  const [file, setFile] = useState<FileData | null>(null);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [format, setFormat] = useState("Page {n} of {total}");

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

  const handleApplyNumbers = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const res = await pdfToolsApi.addPageNumbers(file._id, {
        position,
        startNumber,
        fontSize,
        format,
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const fullUrl = res.downloadUrl.startsWith("http") ? res.downloadUrl : `${API_URL}${res.downloadUrl}`;
      setDownloadUrl(fullUrl);
      showToast("Page numbers added successfully!");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to add page numbers", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="PDF Page Numberer — Add Page Numbers to PDF Online"
        description="Automatically insert page numbers into your PDF documents. Select position, format, font size, and starting number."
        canonical="/pdf-number"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Page Numberer", href: "/pdf-number" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold text-xs mb-4">
            <LuFilePlus size={14} /> PDF Page Numberer
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Add Page Numbers to PDF</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Number pages in your PDF files automatically. Choose placement, number format, font size, and custom offset.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <PdfUploadDropzone onFilesSelected={handleFileSelect} loading={uploading} title="Upload PDF Document" />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)]">Ready for numbering</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-blue-500"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-center">Top Center</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Format Pattern</label>
                      <input
                        type="text"
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-blue-500"
                        placeholder="Page {n} of {total}"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Start Number</label>
                      <input
                        type="number"
                        min="1"
                        value={startNumber}
                        onChange={(e) => setStartNumber(Number(e.target.value))}
                        className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Font Size ({fontSize}pt)</label>
                    <input
                      type="range" min="8" max="24" value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>

                  <Button onClick={handleApplyNumbers} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl mt-4">
                    {processing ? "Adding Page Numbers..." : "Add Page Numbers"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <h3 className="font-bold text-lg mb-2">Live Status</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your numbered document will appear here when completed.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-fadeIn">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Page Numbers Inserted!</h4>
                    <p className="text-xs text-[var(--text-muted)] mb-4">Click below to download your numbered PDF.</p>
                    <a href={downloadUrl} download className="inline-block w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Numbered PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a PDF and configure layout to insert page numbers.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Page Numberer"
          toolDescription="Easily insert page numbers into your multi-page PDF documents. Pick custom locations, formats like 'Page X of Y', and custom starting numbers."
          steps={[
            { name: "Upload PDF", text: "Select and upload your PDF file." },
            { name: "Choose Layout", text: "Choose your desired page number position and custom pattern." },
            { name: "Insert & Download", text: "Click 'Add Page Numbers' to process all pages instantly and download." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
