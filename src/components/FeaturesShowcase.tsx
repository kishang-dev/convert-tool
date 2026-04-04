import React from 'react';
import {
    Merge,
    Scissors,
    FileText,
    FileSpreadsheet,
    Image,
    Lock,
    RotateCw,
    Edit,
    Mic,
    Sparkles,
    Minimize2,
    Video,
    Music,
    Presentation,
    Type,
} from 'lucide-react';
import Card from './Card';
import { useRouter } from 'next/router';

const features = [
    {
        icon: Merge,
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into a single document effortlessly.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Scissors,
        title: 'Split PDF',
        description: 'Extract pages from your PDF and create separate documents.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: FileText,
        title: 'PDF to Word',
        description: 'Convert PDF documents to editable Word files instantly.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: FileSpreadsheet,
        title: 'PDF to Excel',
        description: 'Transform PDF tables into Excel spreadsheets with ease.',
        color: 'from-orange-500 to-yellow-500',
    },
    {
        icon: Minimize2,
        title: 'Compress PDF',
        description: 'Reduce PDF file size without compromising quality.',
        color: 'from-red-500 to-pink-500',
    },
    {
        icon: Image,
        title: 'PDF to Image',
        description: 'Convert PDF pages into high-quality image files (PNG, JPG).',
        color: 'from-indigo-500 to-purple-500',
    },
    {
        icon: Lock,
        title: 'Protect PDF',
        description: 'Secure your PDFs with password encryption.',
        color: 'from-yellow-500 to-orange-500',
    },
    {
        icon: RotateCw,
        title: 'Rotate PDF',
        description: 'Rotate PDF pages to the correct orientation.',
        color: 'from-teal-500 to-cyan-500',
    },
    {
        icon: Edit,
        title: 'Edit PDF',
        description: 'Modify text and content directly in your PDF documents.',
        color: 'from-pink-500 to-rose-500',
    },
    {
        icon: Mic,
        title: 'Speech to PDF',
        description: 'Convert your voice recordings into formatted PDF documents.',
        color: 'from-violet-500 to-purple-500',
    },
    {
        icon: Sparkles,
        title: 'Image to SVG',
        description: 'Transform raster images into scalable vector graphics.',
        color: 'from-fuchsia-500 to-pink-500',
    },
    {
        icon: FileText,
        title: 'Image OCR',
        description: 'Extract text from images using advanced OCR technology.',
        color: 'from-sky-500 to-blue-500',
    },
    {
        icon: Sparkles,
        title: 'AI Chart Maker',
        description: 'Generate flowcharts, workflow diagrams, and BPMN charts using AI prompts.',
        color: 'from-blue-600 to-indigo-600',
    },
    // ---- New Additions ----
    {
        icon: FileText,
        title: 'Word to PDF',
        description: 'Convert Microsoft Word documents (DOCX) seamlessly into PDF format.',
        color: 'from-blue-500 to-indigo-500',
    },
    {
        icon: Presentation,
        title: 'PowerPoint to PDF',
        description: 'Transform PPT presentations into static PDF slides.',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Image,
        title: 'Image Converter',
        description: 'Convert between JPG, PNG, and WebP, or SVG to raster formats.',
        color: 'from-teal-400 to-emerald-500',
    },
    {
        icon: Type,
        title: 'Text & CSV to PDF',
        description: 'Generate clean PDF documents from plain text and CSV files.',
        color: 'from-stone-500 to-gray-500',
    },
    {
        icon: FileSpreadsheet,
        title: 'PDF to CSV',
        description: 'Extract tables and data from PDF straight into CSV files.',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        icon: Mic,
        title: 'PDF to Speech',
        description: 'Convert document text into lifelike audio using AI.',
        color: 'from-pink-500 to-rose-500',
    },
    {
        icon: Video,
        title: 'Video to PDF Notes',
        description: 'Automatically transcribe videos and generate summarized PDF notes.',
        color: 'from-purple-500 to-fuchsia-500',
    },
    {
        icon: Music,
        title: 'Audio to PDF Transcript',
        description: 'Generate complete PDF text transcriptions from spoken audio.',
        color: 'from-indigo-500 to-violet-500',
    },
];

export default function FeaturesShowcase() {
    const router = useRouter();

    return (
        <section id="features" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-white leading-[1.1] tracking-tighter uppercase">
                        Powerful Tools at Your
                        <span className="gradient-text"> Fingertips</span>
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4 opacity-80 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                        Everything you need to work with PDFs and documents, all in one place.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                variant="elevated"
                                hover
                                className="p-6 animate-fadeIn"
                                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
                                onClick={() => router.push('/tools')}
                            >
                                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
