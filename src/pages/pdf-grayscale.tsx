import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import PdfUploadDropzone from "@/components/PdfUploadDropzone";
import { fileAPI, FileData, pdfToolsApi } from "@/lib/api";
import { LuFileText, LuDownload, LuCheck } from "react-icons/lu";

export default function PdfGrayscale() {
  const [file, setFile] = useState<FileData | null>(null);
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
    setUploading(true);
    try {
      const response = await fileAPI.uploadFiles([files[0]]);
      setFile(response.files[0]);
      showToast("PDF uploaded successfully.");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await pdfToolsApi.convertToGrayscale(file._id);
      setDownloadUrl(result.downloadUrl);
      showToast("PDF converted to grayscale!");
    } catch (err: any) {
      showToast("Failed to convert PDF to grayscale.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="PDF Grayscale Converter - Black & White PDF" description="Convert color PDF files into black and white grayscale for print savings." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Grayscale Converter", href: "/pdf-grayscale" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuFileText size={14} /> Black & White PDF Converter
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">PDF Grayscale Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert color PDF files into high-contrast monochrome black & white documents.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <PdfUploadDropzone onFilesSelected={handleFileSelect} loading={uploading} title="Upload Color PDF File" />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)]">Ready for grayscale conversion</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <Button onClick={handleConvert} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Converting to Grayscale..." : "Convert to Black & White"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Grayscale Result</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Download your monochrome PDF file below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Grayscale Ready!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Grayscale PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a color PDF to convert to grayscale.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Grayscale Converter"
          toolDescription="Transform colorful PDF documents into black-and-white vector graphics for cost-effective printing."
          steps={[
            { name: "Upload PDF", text: "Upload your color PDF document." },
            { name: "Convert", text: "Click 'Convert to Black & White'." },
            { name: "Download", text: "Download your grayscale PDF." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
