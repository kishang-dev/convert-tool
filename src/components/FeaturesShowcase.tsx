import React from 'react';
import {
    Merge,
    Scissors,
    FileText,
    Image,
    Sparkles,
    Code,
    ArrowRight,
    Zap,
    Shield,
    Layers,
} from 'lucide-react';
import Card from './Card';
import { useRouter } from 'next/router';

// Only the most iconic / popular tools shown as a teaser on the home page.
// Full list lives on /tools
const highlights = [
    {
        icon: Merge,
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into a single polished document in seconds.',
        color: 'from-blue-500 to-cyan-500',
        tag: 'Most Popular',
    },
    {
        icon: Scissors,
        title: 'Split & Extract PDF',
        description: 'Pull out specific pages or split a PDF into separate files effortlessly.',
        color: 'from-purple-500 to-pink-500',
        tag: null,
    },
    {
        icon: FileText,
        title: 'PDF ↔ Word / Excel',
        description: 'Instantly convert between PDF, Word, Excel, and PowerPoint formats.',
        color: 'from-green-500 to-emerald-500',
        tag: null,
    },
    {
        icon: Image,
        title: 'Image Toolkit',
        description: 'Resize, crop, and convert images between HEIC, WEBP, JPG, and PNG.',
        color: 'from-teal-500 to-cyan-600',
        tag: 'New',
    },
    {
        icon: Sparkles,
        title: 'AI Resume & Charts',
        description: 'Build professional resumes and generate diagrams with AI assistance.',
        color: 'from-amber-400 to-orange-600',
        tag: 'AI Powered',
    },
    {
        icon: Code,
        title: 'Developer Utilities',
        description: 'Format JSON, test Regex, validate XML, build SQL queries, and minify code.',
        color: 'from-indigo-500 to-violet-600',
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
        <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-14 px-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-5 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Sparkles size={13} />
                        40+ Professional Tools
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 text-white leading-[1.1] tracking-tighter uppercase">
                        Powerful Tools at Your
                        <span className="gradient-text"> Fingertips</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed opacity-80 font-medium">
                        Everything you need for documents, images, and developer utilities — all in one place. No installs, no limits.
                    </p>
                </div>

                {/* Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="flex flex-col items-center text-center p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-white/10 transition-all">
                                <Icon size={20} className="text-indigo-400 mb-2" />
                                <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Highlights Grid — 6 curated cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                    {highlights.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                variant="elevated"
                                hover
                                className="p-6 cursor-pointer group animate-fadeIn relative overflow-hidden"
                                style={{ animationDelay: `${index * 0.07}s` } as React.CSSProperties}
                                onClick={() => router.push('/tools')}
                            >
                                {/* Tag badge */}
                                {feature.tag && (
                                    <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                                        {feature.tag}
                                    </span>
                                )}

                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <Icon className="text-white" size={22} />
                                </div>
                                <h3 className="text-base font-bold mb-1.5 text-white tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA — directs users to the full /tools page */}
                <div className="text-center">
                    <button
                        onClick={() => router.push('/tools')}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 group"
                    >
                        Explore All 40+ Tools
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-gray-600 text-[11px] mt-3 uppercase tracking-widest font-bold">
                        No sign-up required · 100% free
                    </p>
                </div>
            </div>
        </section>
    );
}
