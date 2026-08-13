// pages/ocr.tsx
import React, { useState, useRef } from "react";
import { LuUpload as Upload, LuFileText as FileText, LuLoader as Loader2, LuImage as ImageIcon, LuSparkles as Sparkles } from "react-icons/lu";
import Toast from "@/components/Toast";
import { ocrApi } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import * as gtag from '@/lib/gtag';
import ToolSEOContent from '@/components/ToolSEOContent';
import Breadcrumbs from '@/components/Breadcrumbs';
import AdBanner from "@/components/AdBanner";

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
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <SEO
                title="Free OCR Tool — Extract Text from Images"
                description="Extract text from images instantly using ToolBasketAI's free AI-powered OCR tool. Supports English, Hindi, Gujarati and more. No sign-up required."
                canonical="/ocr"
                keywords="OCR online, image to text, extract text from image, free OCR tool, AI OCR, Tesseract OCR, Hindi OCR, Gujarati OCR"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'SoftwareApplication',
                    name: 'OCR Tool — ToolBasketAI',
                    applicationCategory: 'UtilitiesApplication',
                    operatingSystem: 'Web',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                }}
            />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'Image OCR', href: '/ocr' }]} />

                <div className="mb-8 animate-fadeIn">
                    <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Image OCR Tool</h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-2xl">
                        Extract text from images (English, Hindi, Gujarati) instantly using AI-powered OCR.
                    </p>
                </div>
                <AdBanner adFormat="responsive" label="Advertisement" className="my-6" adSlot="2285841467" />


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
                                <ImageIcon className="text-[var(--text)] dark:text-[var(--text)]" size={48} />
                            </div>
                            <p className="text-xl text-[var(--text-muted)] dark:text-[var(--text-muted)]">
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
                            <h3 className="text-lg font-semibold mb-4 text-[var(--text)] dark:text-[var(--text)] flex items-center gap-2">
                                <ImageIcon size={20} className="text-[var(--accent)]" />
                                Image Preview
                            </h3>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full rounded border border-[var(--border)] dark:border-[var(--border)]"
                            />
                        </Card>

                        {/* OCR Results */}
                        {ocrResult && (
                            <Card variant="elevated" className="p-6">
                                <h3 className="text-lg font-semibold mb-4 text-[var(--text)] dark:text-[var(--text)] flex items-center gap-2">
                                    <FileText size={20} className="text-[var(--accent)]" />
                                    Extracted Text
                                </h3>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-[var(--bg)] border border-[var(--border-strong)] p-4 rounded">
                                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Confidence</p>
                                        <p className="text-2xl font-bold gradient-text">
                                            {ocrResult.stats.confidence}%
                                        </p>
                                    </div>
                                    <div className="bg-[var(--bg)] border border-[var(--border-strong)] p-4 rounded">
                                        <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">Words Found</p>
                                        <p className="text-2xl font-bold gradient-text">
                                            {ocrResult.stats.wordCount}
                                        </p>
                                    </div>
                                </div>

                                {/* Full Text */}
                                <div className="bg-[var(--surface-hover)] border border-[var(--border-strong)] p-4 rounded max-h-96 overflow-y-auto custom-scrollbar">
                                    <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] mb-2">Full Text:</p>
                                    <p className="whitespace-pre-wrap text-[var(--text)] dark:text-[var(--text)]">
                                        {ocrResult.data.fullText || "No text detected"}
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </main>

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

            <ToolSEOContent toolName="Free OCR Tool — Extract Text from Images" toolDescription="Extract text from images instantly using ToolBasketAI" />
            <Footer />
        </div>
    );
}
