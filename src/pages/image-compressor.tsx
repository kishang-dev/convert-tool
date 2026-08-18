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
import { LuMaximize2, LuImage, LuCloudUpload, LuDownload, LuCheck } from "react-icons/lu";

export default function ImageCompressor() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(75);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [targetFormat, setTargetFormat] = useState<string>("original");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const response = await fileAPI.uploadFiles([e.target.files[0]]);
      setFile(response.files[0]);
      showToast("Image uploaded successfully.");
    } catch (err: any) {
      showToast("Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await conversionApi.compressImage(file._id, quality, {
        targetFormat: targetFormat === "original" ? undefined : targetFormat
      });
      setDownloadUrl(result.downloadUrl);
      showToast("Image compressed successfully!");
    } catch (err: any) {
      showToast("Image compression failed.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="Image Compressor - Reduce Image Size Online" description="Shrink PNG, JPG, and WebP image file sizes with customizable quality slider." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Image Compressor", href: "/image-compressor" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuMaximize2 size={14} /> Image Compressor
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Compress Image Files</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Reduce image file size (PNG, JPG, WebP) up to 80% while retaining high visual clarity.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="img-compress-upload" />
                <label htmlFor="img-compress-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>
                  <span className="font-bold text-sm">Upload Image File</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports PNG, JPG, WebP</span>
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
                      <span className="text-xs text-[var(--text-muted)] font-mono">Ready for compression</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    <span>Compression Quality</span>
                    <span className="text-emerald-500 font-mono">{quality}%</span>
                  </div>
                  <input type="range" min="10" max="95" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-emerald-500 mb-2" />
                  <div className="flex gap-2">
                    {[
                      { label: "Best Quality (90%)", q: 90 },
                      { label: "Balanced (75%)", q: 75 },
                      { label: "Max Compression (40%)", q: 40 },
                    ].map((p) => (
                      <button
                        key={p.q}
                        type="button"
                        onClick={() => setQuality(p.q)}
                        className={`text-[10px] px-2 py-1 rounded border transition ${quality === p.q
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                          }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Convert Format (Optional)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Keep Original", fmt: "original" },
                      { label: "WEBP", fmt: "webp" },
                      { label: "PNG", fmt: "png" },
                      { label: "JPG", fmt: "jpg" },
                    ].map((item) => (
                      <button
                        key={item.fmt}
                        type="button"
                        onClick={() => setTargetFormat(item.fmt)}
                        className={`py-2 rounded-xl border text-xs font-bold transition ${targetFormat === item.fmt
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCompress} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Compressing Image..." : "Compress Image"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Compressed Output</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Download your optimized image file below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Compression Done!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Compressed Image
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload an image and click compress.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Image Compressor"
          toolDescription="Fast online image compression tool with custom quality controls."
          steps={[
            { name: "Upload Image", text: "Select and upload your photo or graphic." },
            { name: "Adjust Quality", text: "Choose desired quality percentage using the slider." },
            { name: "Compress & Download", text: "Download your compressed image file." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
