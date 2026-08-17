import React from 'react';
import { LuUpload as Upload, LuSettings as Settings, LuDownload as Download } from "react-icons/lu";

const steps = [
    {
        num: '01',
        icon: Upload,
        title: 'Upload Your File',
        description: 'Drag and drop or click to select a PDF, image, Word doc, or any other supported format.',
    },
    {
        num: '02',
        icon: Settings,
        title: 'Choose a Tool',
        description: 'Pick from 75+ tools — convert, compress, merge, split, protect, and more.',
    },
    {
        num: '03',
        icon: Download,
        title: 'Download Instantly',
        description: 'Your processed file is ready in seconds. Download it directly to your device.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
            <style>{`
                .feature-card:hover .feature-icon-box {
                    background: var(--accent) !important;
                    border-color: var(--accent) !important;
                    transform: scale(1.05) rotate(3deg);
                }
                .feature-card:hover .feature-icon {
                    color: #fff !important;
                }
            `}</style>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-2">How it works</p>
                    <h2 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: 'clamp(26px,4vw,36px)', letterSpacing: '-.02em', margin: '0 0 10px', color: 'var(--text)' }}>Three steps to done</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0, fontFamily: '"Poppins", sans-serif' }}>Get your files processed instantly without any hassle.</p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.num}
                                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '28px 24px', transition: 'all 0.3s ease', position: 'relative', display: 'flex', flexDirection: 'column' }}
                                className="hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] feature-card"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', transition: 'all 0.3s ease' }} className="feature-icon-box">
                                        <Icon size={20} className="text-[var(--accent)] transition-colors duration-300 feature-icon" />
                                    </div>
                                    <span style={{ fontSize: 54, fontWeight: 800, color: 'var(--border-strong)', opacity: 0.3, lineHeight: 1, fontFamily: '"Sora", sans-serif', letterSpacing: '-0.04em', pointerEvents: 'none' }}>{step.num}</span>
                                </div>
                                <h3 style={{ fontFamily: '"Poppins", sans-serif', fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 8 }}>{step.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
