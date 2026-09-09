import React from 'react';
import Head from 'next/head';
import { LuShield as Shield, LuGlobe as Globe, LuZap as Zap, LuCircleCheck as CheckCircle2, LuLock as Lock, LuSmartphone as Smartphone } from "react-icons/lu";
import { MASTER_SEO_DATA } from '@/data/seoKeywordsData';

export interface Step {
    name: string;
    text: string;
}

export interface Feature {
    title: string;
    description: string;
    icon?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

interface ToolSEOContentProps {
    toolName: string;
    toolDescription?: string;
    steps?: Step[];
    features?: Feature[];
    faqs?: FAQ[];
    toolId?: string;
}

export default function ToolSEOContent({ toolName, toolDescription, steps, features, faqs, toolId }: ToolSEOContentProps) {
    const metaDataKey = toolId || toolName.toLowerCase().replace(/\s+/g, '-');
    const masterData = MASTER_SEO_DATA[metaDataKey];

    const effectiveSteps = steps && steps.length > 0 ? steps : masterData?.steps;
    const effectiveFaqs = faqs && faqs.length > 0 ? faqs : masterData?.faqs;

    const defaultSteps: Step[] = [
        { name: "Upload or Input File", text: `Select or drag and drop your document/file into the free ${toolName} online tool.` },
        { name: "Process Instantly", text: `Click the process button to run ${toolName} securely with high accuracy.` },
        { name: "Download Output", text: `Save your converted or processed result file directly to your device for free.` }
    ];

    const finalSteps = effectiveSteps && effectiveSteps.length > 0 ? effectiveSteps : defaultSteps;

    const defaultFeatures: Feature[] = [
        { title: "Works on Any Device & OS", description: "Access on Windows, Mac, Linux, iOS, or Android straight from your browser without installing software.", icon: "device" },
        { title: "Fast & High Performance", description: "Blazing fast cloud & client processing speeds optimized for instant document workflows.", icon: "zap" },
        { title: "100% Secure & Private", description: "End-to-end encrypted transfer with automatic file deletion after processing to protect your privacy.", icon: "shield" }
    ];

    const finalFeatures = features && features.length > 0 ? features : defaultFeatures;

    const defaultFaqs: FAQ[] = [
        { question: `Is ${toolName} completely free to use?`, answer: `Yes, ${toolName} on ToolBasketAI is 100% free with no registration or hidden fees.` },
        { question: `Is my file safe when using ${toolName}?`, answer: `Absolute privacy is guaranteed. All uploaded files are encrypted and permanently deleted shortly after processing.` },
        { question: `Do I need to install any software to use ${toolName}?`, answer: `No software installation or browser extension is required. Everything runs smoothly inside your modern browser.` }
    ];

    const finalFaqs = effectiveFaqs && effectiveFaqs.length > 0 ? effectiveFaqs : defaultFaqs;

    const renderIcon = (type?: string) => {
        switch (type) {
            case 'shield': return <Shield className="text-[var(--accent)]" size={28} />;
            case 'zap': return <Zap className="text-yellow-400" size={28} />;
            case 'device': return <Smartphone className="text-blue-400" size={28} />;
            case 'globe': return <Globe className="text-green-400" size={28} />;
            case 'lock': return <Lock className="text-red-400" size={28} />;
            default: return <CheckCircle2 className="text-[var(--accent)]" size={28} />;
        }
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${toolName} Online`,
        "description": toolDescription || `Step-by-step guide on how to use ${toolName} for free online.`,
        "step": finalSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text
        }))
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": finalFaqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 border-t border-[var(--border)] dark:border-[var(--border)] mt-12">
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            </Head>
            
            {/* Features Section */}
            <article className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Use Our Free {toolName}?</h2>
                    {toolDescription && <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] max-w-2xl mx-auto">{toolDescription}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {finalFeatures.map((feat, idx) => (
                        <div key={idx} className="text-center p-6 bg-[var(--bg)] dark:bg-[var(--accent-soft)] rounded border border-[var(--border)] dark:border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors">
                            <div className="w-14 h-14 mx-auto bg-[var(--surface)] dark:bg-[var(--surface)] shadow-sm rounded flex items-center justify-center mb-6">
                                {renderIcon(feat.icon)}
                            </div>
                            <h3 className="text-lg font-bold mb-3">{feat.title}</h3>
                            <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)] leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </article>

            {/* How To Section */}
            <article className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Use {toolName} in 3 Simple Steps</h2>
                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">Follow this simple guide to finish your tasks instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-[var(--accent-soft)] to-indigo-500/0"></div>
                    
                    {finalSteps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--surface)] dark:bg-[var(--surface)] border-2 border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-xl font-black mb-6 shadow-sm z-10 relative">
                                {idx + 1}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{step.name}</h3>
                            <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted)]">{step.text}</p>
                        </div>
                    ))}
                </div>
            </article>

            {/* FAQ Section */}
            <article>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-[var(--text-muted)]">Common questions about {toolName}.</p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {finalFaqs.map((faq, idx) => (
                        <div key={idx} className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
                            <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </article>
            
        </section>
    );
}
