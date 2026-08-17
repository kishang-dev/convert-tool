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
import { LuPenLine, LuFileText, LuDownload, LuCheck } from "react-icons/lu";

export default function PdfMetadata() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [keywords, setKeywords] = useState("");
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
      setTitle(response.files[0].originalName.replace(/\.pdf$/i, ""));
      showToast("PDF uploaded successfully.");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const result = await pdfToolsApi.updateMetadata(file._id, { title, author, subject, keywords });
      setDownloadUrl(result.downloadUrl);
      showToast("PDF metadata updated successfully!");
    } catch (err: any) {
      showToast("Failed to update metadata.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="PDF Metadata Editor - View & Edit PDF Properties" description="Edit Title, Author, Subject, and Keyword meta tags inside PDF headers." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Metadata Editor", href: "/pdf-metadata" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuPenLine size={14} /> PDF Properties Editor
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Edit PDF Metadata</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Modify PDF header properties including Title, Author, Subject, and search Keywords.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <PdfUploadDropzone onFilesSelected={handleFileSelect} loading={uploading} title="Upload PDF Document" />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)]">Ready for property edits</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-sm outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-sm outline-none focus:border-pink-500" placeholder="e.g. John Doe" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-sm outline-none focus:border-pink-500" placeholder="e.g. Annual Financial Report" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Keywords</label>
                    <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl text-sm outline-none focus:border-pink-500" placeholder="e.g. report, finance, 2026" />
                  </div>
                </div>

                <Button onClick={handleUpdate} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Updating Metadata..." : "Save Metadata"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Updated File</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your modified PDF download link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Metadata Updated!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Updated PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a PDF and fill in metadata fields to save.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Metadata Editor"
          toolDescription="Directly edit internal PDF metadata tags for document cataloging, SEO indexing, and authorship credit."
          steps={[
            { name: "Upload PDF", text: "Select and upload your PDF file." },
            { name: "Fill Metadata", text: "Enter Title, Author, Subject, and Keywords." },
            { name: "Save & Download", text: "Save changes and download your updated PDF." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
