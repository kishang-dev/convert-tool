// pages/ocr.tsx
import React, { useState, useRef } from "react";
import { Upload, FileText, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import Toast from "@/components/Toast";
import { ocrApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';

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
        <div className="min-h-screen">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <SEO
                title="Free OCR Tool — Extract Text from Images"
                description="Extract text from images instantly using ToolBasket's free AI-powered OCR tool. Supports English, Hindi, Gujarati and more. No sign-up required."
                canonical="/ocr"
                keywords="OCR online, image to text, extract text from image, free OCR tool, AI OCR, Tesseract OCR, Hindi OCR, Gujarati OCR"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'OCR Tool — ToolBasket',
                    applicationCategory: 'UtilitiesApplication',
                    operatingSystem: 'Web',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                }}
            />
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 -z-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Floating Elements */}
            <div className="fixed top-20 right-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float -z-10"></div>
            <div className="fixed bottom-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float -z-10" style={{ animationDelay: '1.5s' }}></div>

            <div className="max-w-7xl mx-auto px-4 py-24">
                {/* Header */}
                <div className="text-center mb-16 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
                        <Sparkles className="text-purple-400" size={16} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">AI-Powered OCR</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Image OCR</span> Tool
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Extract text from images (English, Hindi, Gujarati)
                    </p>
                </div>

                {/* Upload Area */}
                <Card
                    variant="elevated"
                    className="mb-8 animate-fadeIn"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="p-12 text-center"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-full shadow-lg">
                                <ImageIcon className="text-gray-900 dark:text-white" size={48} />
                            </div>
                            <p className="text-xl text-gray-700 dark:text-gray-300">
                                Drag & Drop Image Here or
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                loading={loading}
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing OCR...
                                    </>
                                ) : (
                                    "Choose Image"
                                )}
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </Card>

                {/* Preview and Results */}
                {preview && (
                    <div className="grid md:grid-cols-2 gap-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        {/* Image Preview */}
                        <Card variant="elevated" className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <ImageIcon size={20} className="text-purple-400" />
                                Image Preview
                            </h3>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                            />
                        </Card>

                        {/* OCR Results */}
                        {ocrResult && (
                            <Card variant="elevated" className="p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText size={20} className="text-purple-400" />
                                    Extracted Text
                                </h3>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="glass p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                                        <p className="text-2xl font-bold gradient-text">
                                            {ocrResult.stats.confidence}%
                                        </p>
                                    </div>
                                    <div className="glass p-4 rounded-lg">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Words Found</p>
                                        <p className="text-2xl font-bold gradient-text">
                                            {ocrResult.stats.wordCount}
                                        </p>
                                    </div>
                                </div>

                                {/* Full Text */}
                                <div className="glass-strong p-4 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Full Text:</p>
                                    <p className="whitespace-pre-wrap text-gray-900 dark:text-white">
                                        {ocrResult.data.fullText || "No text detected"}
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #3b82f6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #2563eb);
                }
            `}</style>
        
            <ToolSEOContent toolName="Free OCR Tool — Extract Text from Images" toolDescription="Extract text from images instantly using ToolBasket" />
        </div>
    );
}
