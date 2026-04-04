import React from 'react';
import { Upload, Settings, Download } from 'lucide-react';
import Card from './Card';

const steps = [
    {
        icon: Upload,
        title: 'Upload Your File',
        description: 'Drag and drop or click to upload your PDF or image file. We support all major formats.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Settings,
        title: 'Choose Operation',
        description: 'Select from our wide range of tools: convert, merge, split, edit, and more.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Download,
        title: 'Download Result',
        description: 'Get your processed file instantly. All operations complete in seconds.',
        color: 'from-green-500 to-emerald-500',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-xs sm:text-base text-gray-400 font-bold uppercase tracking-widest opacity-60">
                        Three simple steps to transform your documents
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connection Lines */}
                    <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-30"></div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                <Card variant="elevated" className="p-8 text-center h-full">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 mt-4`}>
                                        <Icon className="text-white" size={32} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-semibold mb-3 text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
