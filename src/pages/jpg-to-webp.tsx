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
import { LuImage, LuCloudUpload, LuDownload, LuCheck } from "react-icons/lu";

export default function JpgToWebp() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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
      showToast("JPG uploaded successfully.");
    } catch (err: any) {
      showToast("JPG upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await conversionApi.jpgToWebp(file._id, quality);
      setDownloadUrl(result.downloadUrl);
      showToast("JPG converted to WebP!");
    } catch (err: any) {
      showToast("Conversion failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="JPG to WEBP Converter - Convert JPEG Photos to WebP" description="Compress standard JPEG photos into modern WebP format for web optimization." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "JPG to WEBP Converter", href: "/jpg-to-webp" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuImage size={14} /> JPG to WebP Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">JPG to WebP Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Compress JPEG photos into next-gen WebP image files for faster page load times.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/jpeg,image/jpg" onChange={handleFileSelect} className="hidden" id="jpg-upload" />
                <label htmlFor="jpg-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload JPG Photo</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports .jpg & .jpeg files</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <LuImage size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Ready for WebP conversion</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">WebP Quality ({quality}%)</label>
                  <input type="range" min="20" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-emerald-500" />
                </div>

                <Button onClick={handleConvert} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Converting..." : "Convert JPG to WebP"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">WebP Download</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your converted WebP file will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Converted to WebP!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download WebP Photo
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a JPG photo to convert.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="JPG to WebP Converter"
          toolDescription="Compress JPEG photos into modern WebP format for fast web publishing."
          steps={[
            { name: "Upload JPG", text: "Select your JPG photo file." },
            { name: "Set Quality", text: "Choose WebP rendering quality." },
            { name: "Convert & Download", text: "Download your WebP file." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
