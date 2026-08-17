import React from 'react';
import { LuMerge as Merge, LuScissors as Scissors, LuFileText as FileText, LuImage as Image, LuSparkles as Sparkles, LuCode as Code, LuArrowRight as ArrowRight, LuLayers as Layers, LuShield as Shield, LuZap as Zap } from "react-icons/lu";
import { useRouter } from 'next/router';

const highlights = [
    {
        icon: Merge,
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into a single polished document in seconds.',
        tag: 'Most Popular',
        link: '/merge-pdf',
    },
    {
        icon: Scissors,
        title: 'Split & Extract PDF',
        description: 'Pull out specific pages or split a PDF into separate files effortlessly.',
        tag: null,
        link: '/split-pdf',
    },
    {
        icon: FileText,
        title: 'PDF ↔ Word / Excel',
        description: 'Instantly convert between PDF, Word, Excel, and PowerPoint formats.',
        tag: null,
        link: '/pdf-to-word',
    },
    {
        icon: Image,
        title: 'Image Toolkit',
        description: 'Resize, crop, and convert images between HEIC, WEBP, JPG, and PNG.',
        tag: 'New',
        link: '/image-resizer',
    },
    {
        icon: Sparkles,
        title: 'AI Resume & Charts',
        description: 'Build professional resumes and generate diagrams with AI assistance.',
        tag: 'AI Powered',
        link: '/resume-builder',
    },
    {
        icon: Code,
        title: 'Developer Utilities',
        description: 'Format JSON, test Regex, validate XML, build SQL queries, and minify code.',
        tag: 'New',
        link: '/json-formatter',
    },
];

const stats = [
    { label: 'Total Tools', value: '75+', icon: Layers },
    { label: 'Formats Supported', value: '25+', icon: FileText },
    { label: 'Client-Side Private', value: '100%', icon: Shield },
    { label: 'Processing Speed', value: 'Instant', icon: Zap },
];

export default function FeaturesShowcase() {
    const router = useRouter();

    return (
        <section id="features" className="py-20 px-4 sm:px-6 border-t border-[var(--border)]">
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
                <div className="mb-12">
                    <p className="text-xs text-[var(--accent)] uppercase tracking-widest font-semibold mb-2">Features</p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
                            Everything you need<br className="sm:hidden" /> to succeed
                        </h2>
                        <button
                            onClick={() => router.push('/#tb-tools')}
                            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group shrink-0"
                        >
                            View all tools
                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-2 max-w-xl">
                        Powerful tools designed to help you better process, convert, and manage documents from start to finish.
                    </p>
                </div>

                {/* Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <Icon size={20} className="text-[var(--accent)] mb-1" />
                                <div className="text-2xl font-bold text-[var(--text)]">{stat.value}</div>
                                <div className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highlights.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                                <button
                                key={index}
                                onClick={() => router.push(feature.link || '/#tb-tools')}
                                style={{
                                    background: 'var(--surface)',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative'
                                }}
                                className="hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)] feature-card"
                            >
                                {feature.tag && (
                                    <span style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 10px', borderRadius: 99, background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)', color: 'var(--accent)' }}>
                                        {feature.tag}
                                    </span>
                                )}

                                <div style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)', width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 16, transition: 'all 0.3s ease' }} className="feature-icon-box">
                                    <Icon className="feature-icon" style={{ color: 'var(--accent)', transition: 'color 0.3s ease' }} size={20} />
                                </div>
                                <h3 style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16, marginBottom: 8, fontFamily: '"Poppins", sans-serif' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{feature.description}</p>
                            </button>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
