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
import { LuFiles, LuFileText, LuDownload, LuCheck } from "react-icons/lu";

export default function PdfDeletePages() {
  const [file, setFile] = useState<FileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pagesInput, setPagesInput] = useState("2");
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

  const handleDelete = async () => {
    if (!file) return;
    const pageNumbers = pagesInput.split(",").map((p) => parseInt(p.trim())).filter((p) => !isNaN(p) && p > 0);
    if (pageNumbers.length === 0) return showToast("Enter valid page numbers.", "error");

    setProcessing(true);
    try {
      const result = await pdfToolsApi.deletePages(file._id, pageNumbers);
      setDownloadUrl(result.downloadUrl);
      showToast("Pages removed successfully!");
    } catch (err: any) {
      showToast("Failed to delete pages.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <SEO title="PDF Page Delete - Remove Pages from PDF Online" description="Remove unwanted page numbers or page ranges from your PDF document." />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <Breadcrumbs items={[{ label: "PDF Page Delete", href: "/pdf-delete-pages" }]} />

        <div className="text-center my-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-500 font-semibold text-xs mb-4">
            <LuFiles size={14} /> PDF Page Remover
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">Delete PDF Pages</h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base max-w-2xl mx-auto">
            Remove unwanted or redundant pages from your PDF document easily.
          </p>
        </div>

        <AdBanner adSlot="2285841467" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          <div className="md:col-span-7">
            {!file ? (
              <PdfUploadDropzone onFilesSelected={handleFileSelect} loading={uploading} title="Upload PDF File" />
            ) : (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                      <LuFileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm truncate max-w-xs">{file.originalName}</h3>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Ready for page removal</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setFile(null); setDownloadUrl(null); }}>Change</Button>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">Pages to Delete (comma-separated)</label>
                  <input
                    type="text"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl outline-none text-sm focus:border-pink-500 font-mono"
                    placeholder="e.g. 2, 4"
                  />
                </div>

                <Button onClick={handleDelete} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3.5 rounded-xl">
                  {processing ? "Deleting Pages..." : "Delete Pages & Download"}
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-5">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm min-h-[300px] flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">Output PDF</h3>
                <p className="text-xs text-[var(--text-muted)] mb-6">Your modified PDF download link will appear below.</p>

                {downloadUrl ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                    <LuCheck className="mx-auto text-emerald-500 mb-2" size={32} />
                    <h4 className="font-extrabold text-sm text-emerald-500 mb-1">Pages Deleted!</h4>
                    <a href={downloadUrl} download className="inline-block w-full mt-3">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                        <LuDownload size={16} /> Download Trimmed PDF
                      </Button>
                    </a>
                  </div>
                ) : (
                  <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-xs text-[var(--text-muted)]">
                    Upload a PDF and enter page numbers to delete.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <ToolSEOContent
          toolName="PDF Page Remover"
          toolDescription="Strip unwanted pages from PDF files without degrading quality or text layout."
          steps={[
            { name: "Upload PDF", text: "Select and upload your PDF file." },
            { name: "Enter Page Numbers", text: "Enter page numbers you wish to delete." },
            { name: "Delete & Download", text: "Download your newly trimmed PDF." }
          ]}
        />
      </main>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
