import React from 'react';
import Head from 'next/head';
import { Shield, Globe, Zap, CheckCircle2, Lock, Smartphone } from 'lucide-react';

export interface Step {
    name: string;
    text: string;
}

export interface Feature {
    title: string;
    description: string;
    icon?: string;
}

interface ToolSEOContentProps {
    toolName: string;
    toolDescription?: string;
    steps?: Step[];
    features?: Feature[];
}

export default function ToolSEOContent({ toolName, toolDescription, steps, features }: ToolSEOContentProps) {
    const defaultSteps: Step[] = [
        { name: "Upload File", text: `Upload or drag and drop your file(s) into the ${toolName} tool.` },
        { name: "Process", text: `Click the primary action button to execute the ${toolName} process.` },
        { name: "Download", text: "Download or copy your final processed files instantly." }
    ];

    const finalSteps = steps && steps.length > 0 ? steps : defaultSteps;

    const defaultFeatures: Feature[] = [
        { title: "Works on Any Device", description: "Use our tools on Mac, Windows, iOS, or Android without installing any software.", icon: "device" },
        { title: "Fast & Reliable", description: "Experience lightning-fast processing speeds with our optimized cloud infrastructure.", icon: "zap" },
        { title: "Privacy Guaranteed", description: "Your files are encrypted during transfer and automatically deleted after processing.", icon: "shield" }
    ];

    const finalFeatures = features && features.length > 0 ? features : defaultFeatures;

    const renderIcon = (type?: string) => {
        switch (type) {
            case 'shield': return <Shield className="text-indigo-400" size={28} />;
            case 'zap': return <Zap className="text-yellow-400" size={28} />;
            case 'device': return <Smartphone className="text-blue-400" size={28} />;
            case 'globe': return <Globe className="text-green-400" size={28} />;
            case 'lock': return <Lock className="text-red-400" size={28} />;
            default: return <CheckCircle2 className="text-indigo-400" size={28} />;
        }
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${toolName}`,
        "description": toolDescription || `Step by step guide on how to use ${toolName}.`,
        "step": finalSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text
        }))
    };

    return (
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 border-t border-gray-200 dark:border-white/10 mt-12">
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            </Head>
            
            {/* Features Section */}
            <article className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Why use our {toolName}?</h2>
                    {toolDescription && <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{toolDescription}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {finalFeatures.map((feat, idx) => (
                        <div key={idx} className="text-center p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-colors">
                            <div className="w-14 h-14 mx-auto bg-white dark:bg-[#111] shadow-sm rounded-2xl flex items-center justify-center mb-6">
                                {renderIcon(feat.icon)}
                            </div>
                            <h3 className="text-lg font-bold mb-3">{feat.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </article>

            {/* How To Section */}
            <article>
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">How to use {toolName}</h2>
                    <p className="text-gray-600 dark:text-gray-400">Follow these simple steps to get your work done quickly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting Line for Desktop */}
                    <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0"></div>
                    
                    {finalSteps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111] border-2 border-indigo-500/20 text-indigo-500 flex items-center justify-center text-xl font-black mb-6 shadow-sm z-10 relative">
                                {idx + 1}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.text}</p>
                        </div>
                    ))}
                </div>
            </article>
            
        </section>
    );
}
