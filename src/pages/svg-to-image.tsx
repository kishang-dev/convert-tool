import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import Toast from "@/components/Toast";
import ToolSEOContent from "@/components/ToolSEOContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import { fileAPI, FileData } from "@/lib/api";
import { conversionApi } from "@/services/api";
import { LuImage, LuDownload, LuCloudUpload, LuCheck } from "react-icons/lu";

export default function SvgToImage() {
  const [file, setFile] = useState<FileData | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [density, setDensity] = useState(300);

  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    const selected = selectedFiles[0];

    if (!selected.name.toLowerCase().endsWith(".svg") && selected.type !== "image/svg+xml") {
      showToast("Please upload a valid SVG file", "error");
      return;
    }

    setUploading(true);
    try {
      const res = await fileAPI.uploadFiles([selected]);
      if (res.files && res.files.length > 0) {
        setFile(res.files[0]);
        setDownloadUrl(null);
        showToast("SVG file uploaded.");
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const res = await conversionApi.svgToImage(file._id, targetFormat, density);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const fullUrl = res.downloadUrl.startsWith("http") ? res.downloadUrl : `${API_URL}${res.downloadUrl}`;
      setDownloadUrl(fullUrl);
      showToast(`Converted to ${targetFormat.toUpperCase()} successfully!`);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Conversion failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="SVG to Image Converter — Convert SVG to PNG, JPG, WebP Free"
        description="Convert vector SVG graphics into high-resolution PNG, JPG, or WebP raster images. Customize DPI density and output format."
        canonical="/svg-to-image"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "SVG to Image", href: "/svg-to-image" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuImage size={14} /> SVG Converter
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">SVG to Image Converter</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Convert scalable vector graphics (SVG) into raster image formats (PNG, JPG, WebP) with ultra-high resolution rendering.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept=".svg,image/svg+xml" onChange={handleFileSelect} className="hidden" id="svg-upload" />
                <label htmlFor="svg-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>

                  <span className="font-bold text-sm">Choose SVG Vector File</span>
                  <span className="text-xs text-[var(--text-muted)]">Upload .svg graphics files</span>
                </label>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <LuImage size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)]">Ready for conversion</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Target Format</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["png", "jpg", "webp"].map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setTargetFormat(fmt)}
                          className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                            targetFormat === fmt
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                              : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Scale Multiplier</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "1x (Std)", val: 1 },
                        { label: "2x (HD)", val: 2 },
                        { label: "4x (4K)", val: 4 },
                        { label: "8x (8K)", val: 8 },
                      ].map((sc) => (
                        <button
                          key={sc.val}
                          onClick={() => setDensity(300 * sc.val)}
                          className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                            density === 300 * sc.val
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                              : "border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]"
                          }`}
                        >
                          {sc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Rendering Density ({density} DPI)</label>
                    <select
                      value={density}
                      onChange={(e) => setDensity(Number(e.target.value))}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-emerald-500"
                    >
                      <option value={72}>72 DPI (Standard Web)</option>
                      <option value={150}>150 DPI (Medium Quality)</option>
                      <option value={300}>300 DPI (High Resolution Print)</option>
                      <option value={600}>600 DPI (Ultra Sharp HD)</option>
                      <option value={1200}>1200 DPI (8K Vector Master)</option>
                    </select>
                  </div>

                  <Button onClick={handleConvert} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl mt-4">
                    {processing ? "Converting SVG..." : `Convert to ${targetFormat.toUpperCase()}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <h3 className="font-bold text-lg mb-2">Output Preview</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Rasterized file download link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-fadeIn">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Conversion Complete!</h4>
                    <p className="text-xs text-[var(--text-muted)] mb-4">Your raster image file is ready for download.</p>
                    <a href={downloadUrl} download className="inline-block w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download {targetFormat.toUpperCase()} Image
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload an SVG file to begin conversion.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="SVG to Image Converter"
          toolDescription="Transform vector graphics into PNG, JPG, or WebP raster formats seamlessly. Control resolution rendering quality for web or print design projects."
          steps={[
            { name: "Upload SVG", text: "Select and upload your SVG graphic file." },
            { name: "Choose Format & DPI", text: "Choose target format (PNG, JPG, WebP) and rendering density (DPI)." },
            { name: "Convert & Download", text: "Download your newly rasterized image file instantly." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
