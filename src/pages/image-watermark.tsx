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
import { LuImage, LuDownload, LuCloudUpload, LuPenTool, LuCheck } from "react-icons/lu";

export default function ImageWatermark() {
  const [file, setFile] = useState<FileData | null>(null);
  const [text, setText] = useState("WATERMARK");
  const [color, setColor] = useState("#ffffff");
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState("center");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(36);

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

    setUploading(true);
    try {
      const res = await fileAPI.uploadFiles([selected]);
      if (res.files && res.files.length > 0) {
        setFile(res.files[0]);
        setDownloadUrl(null);
        showToast("Image uploaded.");
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
      const res = await conversionApi.watermarkImage(file._id, {
        text,
        color,
        strokeColor,
        opacity,
        fontSize,
        rotation,
        position,
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const fullUrl = res.downloadUrl.startsWith("http") ? res.downloadUrl : `${API_URL}${res.downloadUrl}`;
      setDownloadUrl(fullUrl);
      showToast("Watermark applied successfully!");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Watermarking failed", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO
        title="Image Watermark Tool — Add Watermark to Photos Online"
        description="Stamp custom text watermarks onto PNG, JPG, and WebP images. Customize font size, color, and opacity online."
        canonical="/image-watermark"
      />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "Image Watermark", href: "/image-watermark" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-xs mb-4">
            <LuPenTool size={14} /> Image Watermark Tool
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Add Watermark to Images</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Protect your photos and creative assets by adding custom text overlays with customizable opacity and styling.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <div className="border-2 border-dashed border-[var(--border)] hover:border-emerald-500 transition-colors p-8 text-center rounded-2xl bg-[var(--surface)]">
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="img-upload" />
                <label htmlFor="img-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <LuCloudUpload size={32} />
                  </div>

                  <span className="font-bold text-sm">Upload Photo / Image</span>
                  <span className="text-xs text-[var(--text-muted)]">Supports PNG, JPG, WebP, GIF</span>
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
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-emerald-500"
                      placeholder="e.g. COPYRIGHT / MY BRAND"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Font Size ({fontSize}px)</label>
                      <input
                        type="range" min="16" max="96" value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Opacity ({Math.round(opacity * 100)}%)</label>
                      <input
                        type="range" min="0.1" max="1" step="0.05" value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-2">Watermark Position</label>
                    <div className="grid grid-cols-3 gap-2 max-w-[240px]">
                      {[
                        { pos: "top-left", label: "↖ TL" },
                        { pos: "top-center", label: "↑ TC" },
                        { pos: "top-right", label: "↗ TR" },
                        { pos: "center-left", label: "← CL" },
                        { pos: "center", label: "• Center" },
                        { pos: "center-right", label: "→ CR" },
                        { pos: "bottom-left", label: "↙ BL" },
                        { pos: "bottom-center", label: "↓ BC" },
                        { pos: "bottom-right", label: "↘ BR" },
                      ].map((item) => (
                        <button
                          key={item.pos}
                          type="button"
                          onClick={() => setPosition(item.pos)}
                          className={`p-2 rounded-lg border text-xs font-bold transition ${position === item.pos
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                            : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-white"
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Text Color</label>
                      <input
                        type="color" value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full h-10 bg-transparent border border-[var(--border)] rounded-xl cursor-pointer p-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Outline Color</label>
                      <input
                        type="color" value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-full h-10 bg-transparent border border-[var(--border)] rounded-xl cursor-pointer p-1"
                      />
                    </div>
                  </div>

                  <Button onClick={handleApplyWatermark} disabled={processing || !text} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl mt-4">
                    {processing ? "Applying Watermark..." : "Apply Watermark"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <h3 className="font-bold text-lg mb-2">Output Preview</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your watermarked photo link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center animate-fadeIn">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Watermark Applied!</h4>
                    <p className="text-xs text-[var(--text-muted)] mb-4">Your image is ready for download.</p>
                    <a href={downloadUrl} download className="inline-block w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Watermarked Photo
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload an image to start watermarking.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="Image Watermark Tool"
          toolDescription="Stamp watermark text onto photos and digital artwork easily. Protect your visual assets with adjustable font size, text color, and transparency."
          steps={[
            { name: "Upload Image", text: "Select and upload your PNG, JPG, or WebP photo." },
            { name: "Customize Watermark", text: "Type custom text, adjust font size, opacity, and text color." },
            { name: "Apply & Download", text: "Download your watermarked photo instantly." }
          ]}
        />
      </main>


      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
