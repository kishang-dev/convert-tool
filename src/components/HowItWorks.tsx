import React from 'react';
import { Upload, Settings, Download } from 'lucide-react';

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
        description: 'Pick from 40+ tools — convert, compress, merge, split, protect, and more.',
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
        <section className="py-20 px-4 sm:px-6 border-t border-gray-200 dark:border-[#1a1a1a]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <p className="text-xs text-gray-600 dark:text-[#555] uppercase tracking-widest font-medium mb-2">How it works</p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Three steps to done</h2>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.num}
                                className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-xl p-6 hover:border-gray-300 dark:border-[#2a2a2a] transition-colors"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#2a2a2a] p-2.5 rounded-lg">
                                        <Icon size={18} className="text-gray-900 dark:text-white" />
                                    </div>
                                    <span className="text-[#2a2a2a] text-2xl font-bold tabular-nums">{step.num}</span>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-[#555] leading-relaxed">{step.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
