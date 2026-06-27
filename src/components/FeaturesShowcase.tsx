import React from 'react';
import { Merge, Scissors, FileText, Image, Sparkles, Code, ArrowRight, Layers, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

const highlights = [
    {
        icon: Merge,
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into a single polished document in seconds.',
        tag: 'Most Popular',
    },
    {
        icon: Scissors,
        title: 'Split & Extract PDF',
        description: 'Pull out specific pages or split a PDF into separate files effortlessly.',
        tag: null,
    },
    {
        icon: FileText,
        title: 'PDF ↔ Word / Excel',
        description: 'Instantly convert between PDF, Word, Excel, and PowerPoint formats.',
        tag: null,
    },
    {
        icon: Image,
        title: 'Image Toolkit',
        description: 'Resize, crop, and convert images between HEIC, WEBP, JPG, and PNG.',
        tag: 'New',
    },
    {
        icon: Sparkles,
        title: 'AI Resume & Charts',
        description: 'Build professional resumes and generate diagrams with AI assistance.',
        tag: 'AI Powered',
    },
    {
        icon: Code,
        title: 'Developer Utilities',
        description: 'Format JSON, test Regex, validate XML, build SQL queries, and minify code.',
        tag: 'New',
    },
];

const stats = [
    { label: 'Total Tools', value: '40+', icon: Layers },
    { label: 'Formats Supported', value: '25+', icon: FileText },
    { label: 'Client-Side Private', value: '100%', icon: Shield },
    { label: 'Processing Speed', value: 'Instant', icon: Zap },
];

export default function FeaturesShowcase() {
    const router = useRouter();

    return (
        <section id="features" className="py-20 px-4 sm:px-6 border-t border-gray-200 dark:border-[#1a1a1a]">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">Features</p>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Everything you need<br className="sm:hidden" /> to succeed
                        </h2>
                        <button
                            onClick={() => router.push('/tools')}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500 dark:text-[#888] hover:text-gray-900 dark:text-white transition-colors group shrink-0"
                        >
                            View all tools
                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-[#555] mt-2 max-w-xl">
                        Powerful tools designed to help you better process, convert, and manage documents from start to finish.
                    </p>
                </div>

                {/* Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-4 flex flex-col gap-2">
                                <Icon size={16} className="text-gray-500 dark:text-gray-500 dark:text-[#444]" />
                                <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                                <div className="text-[11px] text-gray-600 dark:text-[#555] uppercase tracking-wider">{stat.label}</div>
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
                                onClick={() => router.push('/tools')}
                                className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6 text-left group hover:border-gray-300 dark:border-[#2a2a2a] hover:bg-gray-100 dark:bg-[#161616] transition-all duration-200 relative"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {feature.tag && (
                                    <span className="absolute top-4 right-4 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] text-gray-600 dark:text-[#555]">
                                        {feature.tag}
                                    </span>
                                )}

                                <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] p-2.5 rounded-lg inline-block mb-4 group-hover:border-[#3a3a3a] transition-colors">
                                    <Icon className="text-gray-900 dark:text-white" size={18} />
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold mb-1.5 text-sm">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-[#555] text-xs leading-relaxed">{feature.description}</p>
                            </button>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
