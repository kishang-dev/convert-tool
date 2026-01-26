// pages/ocr.tsx
import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, Image as ImageIcon } from "lucide-react";
import Toast from "@/components/Toast";
import { ocrApi } from "@/services/api";

export default function OcrPage() {
    const [loading, setLoading] = useState(false);
    const [ocrResult, setOcrResult] = useState<any | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (
        message: string,
        type: "success" | "error" = "success"
    ) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            showToast("Please select an image file", "error");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload and process OCR
        setLoading(true);
        try {
            const result = await ocrApi?.uploadImage(file);
            setOcrResult(result);
            showToast("OCR processing completed successfully!", "success");
        } catch (error: any) {
            showToast(
                error.response?.data?.message || "OCR processing failed",
                "error"
            );
            console.error("OCR Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const input = fileInputRef.current;
            if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Image OCR Tool
                    </h1>
                    <p className="text-xl text-gray-600">
                        Extract text from images (English, Hindi, Gujarati)
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 mb-8 text-center"
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-blue-100 p-6 rounded-full">
                            <ImageIcon className="text-blue-500" size={48} />
                        </div>
                        <p className="text-xl text-gray-700">
                            Drag & Drop Image Here or
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing OCR...
                                </>
                            ) : (
                                "Choose Image"
                            )}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* Preview and Results */}
                {preview && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Preview */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Image Preview</h3>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full rounded-lg border"
                            />
                        </div>

                        {/* OCR Results */}
                        {ocrResult && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Extracted Text</h3>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Confidence</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            {ocrResult.stats.confidence}%
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Words Found</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {ocrResult.stats.wordCount}
                                        </p>
                                    </div>
                                </div>

                                {/* Full Text */}
                                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                                    <p className="text-sm text-gray-600 mb-2">Full Text:</p>
                                    <p className="whitespace-pre-wrap">
                                        {ocrResult.data.fullText || "No text detected"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}