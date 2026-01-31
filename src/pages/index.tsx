"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Scissors,
  Merge,
  FileSpreadsheet,
  Image,
  Lock,
  RotateCw,
  CheckCircle,
  Loader2,
  Edit,
  Mic,
  Sparkles,
} from "lucide-react";
import { fileAPI, FileData } from "@/lib/api";
import Toast from "@/components/Toast";
import FeatureCard from "@/components/FeatureCard";
import FileList from "@/components/FileList";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fileAPI.getAllFiles();
      setFiles(response.files || []);
    } catch (error) {
      console.error("Failed to load files:", error);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf",
    );
    await handleFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      await handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    if (newFiles.length === 0) {
      showToast("Please select PDF files only", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.uploadFiles(newFiles);
      setFiles([...response.files, ...files]);
      showToast(`${newFiles.length} file(s) uploaded successfully!`, "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Upload failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleMergePDFs = async () => {
    if (files.length < 2) {
      showToast("Please upload at least 2 PDF files to merge", "error");
      return;
    }

    setLoading(true);
    try {
      const fileIds = files.map((f) => f._id);
      const response = await fileAPI.mergePDFs(fileIds);
      showToast("PDFs merged successfully!", "success");

      // Add merged file to list
      setFiles([response.file, ...files]);

      // Download the merged file
      window.open(fileAPI.getDownloadUrl(response.file.filename), "_blank");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Merge failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSplitPDF = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to split", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.splitPDF(files[0]._id);
      showToast("PDF split successfully!", "success");

      // Add split files to list
      setFiles([...response.files, ...files]);
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Split failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRotatePDF = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to rotate", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.rotatePDF(files[0]._id);
      showToast("PDF rotated successfully!", "success");
      setFiles([response.file, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Rotate failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCompressPDF = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to compress", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.compressPDF(files[0]._id);
      showToast("PDF compressed successfully!", "success");
      setFiles([response.file, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Compression failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToWord = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to convert", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.convertToWord(files[0]._id);
      showToast("Converted to Word successfully!", "success");
      setFiles([response.file, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Conversion failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToExcel = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to convert", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.convertToExcel(files[0]._id);
      showToast("Converted to Excel successfully!", "success");
      setFiles([response.file, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Conversion failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToImage = async () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to convert", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fileAPI.convertToImage(files[0]._id);
      showToast("Converted to Image successfully!", "success");
      setFiles([...response.files, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Conversion failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleProtectPDF = () => {
    if (files.length === 0) {
      showToast("Please upload a PDF file to protect", "error");
      return;
    }
    setShowPasswordModal(true);
  };

  const confirmProtectPDF = async () => {
    if (!password) {
      showToast("Password is required", "error");
      return;
    }

    setShowPasswordModal(false);
    setLoading(true);
    try {
      const response = await fileAPI.protectPDF(files[0]._id, password);
      showToast("PDF protected successfully!", "success");
      setFiles([response.file, ...files]);
    } catch (error: any) {
      showToast(error.response?.data?.error || "Protection failed", "error");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  const handleRemoveFile = async (id: string) => {
    try {
      await fileAPI.deleteFile(id);
      setFiles(files.filter((f) => f._id !== id));
      showToast("File removed successfully", "success");
    } catch (error: any) {
      showToast(
        error.response?.data?.error || "Failed to remove file",
        "error",
      );
    }
  };

  const handleDownloadFile = (file: FileData) => {
    window.open(fileAPI.getDownloadUrl(file.filename), "_blank");
  };

  const features = [
    { icon: Merge, title: "Merge PDF", action: handleMergePDFs },
    { icon: Scissors, title: "Split PDF", action: handleSplitPDF },
    {
      icon: FileText,
      title: "PDF to Word",
      action: handleToWord,
    },
    {
      icon: FileSpreadsheet,
      title: "PDF to Excel",
      action: handleToExcel,
    },
    {
      icon: FileText,
      title: "Compress PDF",
      action: handleCompressPDF,
    },
    {
      icon: Image,
      title: "PDF to Image",
      action: handleToImage,
    },
    {
      icon: Lock,
      title: "Protect PDF",
      action: handleProtectPDF,
    },
    {
      icon: RotateCw,
      title: "Rotate PDF",
      action: handleRotatePDF,
    },
    {
      icon: Edit,
      title: "Edit PDF",
      action: () => {
        if (files.length === 0) {
          showToast("Please upload a PDF file to edit", "error");
          return;
        }
        window.location.href = `/editor/${files[0]._id}`;
      },
    },
    {
      icon: Mic,
      title: "Speech to PDF",
      action: () => {
        window.location.href = "/speech-to-pdf";
      },
    },
    {
      icon: Sparkles,
      title: "Image to SVG",
      action: () => {
        window.location.href = "/svg";
      },
    },

    {
      icon: FileText,
      title: "Image OCR",
      action: () => {
        window.location.href = "/ocr";
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            All-in-One PDF Tools for Your Needs
          </h1>
          <p className="text-xl text-gray-600">
            Edit, Convert & Manage Your PDF Files Easily
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white rounded-2xl border-2 border-dashed p-12 mb-8 text-center transition-all ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="bg-red-100 p-6 rounded-full">
              <Upload className="text-red-500" size={48} />
            </div>
            <p className="text-xl text-gray-700">
              Drag & Drop PDF Files Here or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                "Choose Files"
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* File List */}
        <FileList
          files={files}
          onRemove={handleRemoveFile}
          onDownload={handleDownloadFile}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              onClick={feature.action}
            />
          ))}
        </div>

        {/* Footer Banner */}
        <div className="bg-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} />
            <div>
              <p className="font-semibold">Secure & Fast</p>
              <p className="text-sm text-blue-100">No Registration Required</p>
            </div>
          </div>
          <button className="bg-red-500 px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold">
            Go Pro for More Features
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Protect PDF
            </h3>
            <p className="text-gray-600 mb-4">
              Enter a password to encrypt this PDF.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmProtectPDF}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Protect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
