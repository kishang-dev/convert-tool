import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Shield, Zap, Globe, Heart } from "lucide-react";
import SEO from "@/components/SEO";


export default function AboutPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:text-[var(--text)] flex flex-col font-sans">
            <SEO
                title="About Us"
                description="Learn about ToolBasketAI — the team building the world's most powerful free online toolkit for PDFs, images, and documents. Our mission is fast, private, and beautiful tools for everyone."
                canonical="/about"
                keywords="about ToolBasketAI, online PDF tools team, free document converter, ToolBasketAI mission"
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'AboutPage',
                    name: 'About ToolBasketAI',
                    url: 'https://toolbasketai.com/about',
                    description: 'The team behind ToolBasketAI and our mission to revolutionize modern workflows.',
                }}
            />
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                {/* Hero Section */}
                <section className="px-4 sm:px-6 mb-20 text-center">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-4">Our Mission</p>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                            Revolutionizing modern workflows
                        </h1>
                        <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed max-w-2xl mx-auto">
                            We are building the world's most powerful, fast conversion engine to help creators, engineers, and businesses transform data with precision and style.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 border-y border-[var(--border)] dark:border-[var(--border)] bg-[var(--bg)] dark:bg-[var(--bg)]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Shield, title: 'Security First', desc: 'Your data is your most valuable asset. We use enterprise-grade encryption and privacy-focused processing for every single conversion.' },
                                { icon: Zap, title: 'Velocity Driven', desc: 'Speed shouldn\'t compromise quality. Our advanced infrastructure ensures lightning-fast processing across all file types.' },
                                { icon: Users, title: 'User Centric', desc: 'We design tools that feel human. Every feature is polished to perfection to ensure the best possible user experience.' }
                            ].map((v, i) => (
                                <div key={i} className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-6 hover:border-[var(--border-strong)] dark:border-[var(--border-strong)] transition-colors">
                                    <div className="bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] border border-[var(--border-strong)] dark:border-[var(--border)] p-2.5 rounded inline-block mb-4">
                                        <v.icon size={17} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                    </div>
                                    <h3 className="text-[var(--text)] dark:text-[var(--text)] font-semibold text-sm mb-2">{v.title}</h3>
                                    <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-xs leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            <div>
                                <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest font-medium mb-2">Who We Are</p>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] dark:text-[var(--text)] tracking-tight mb-4">
                                    Our Story
                                </h2>
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed mb-6">
                                    Founded in 2024, ToolBasketAI started with a simple belief: file conversion shouldn't be a chore. Most tools on the market are slow, filled with intrusive ads, and look like they belong in the early 2000s. We decided to change that.
                                </p>
                                <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed">
                                    Today, we provide a comprehensive suite of tools ranging from simple PDF conversions to advanced AI-powered Flowchart generation and CV building. Our team consists of passionate developers and designers dedicated to pushing the boundaries of what's possible in a browser.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Globe size={18} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                        <span className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)]">100+</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest">Countries Reached</p>
                                </div>
                                <div className="bg-[var(--surface)] dark:bg-[var(--surface)] border border-[var(--border)] dark:border-[var(--border)] rounded p-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Heart size={18} className="text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)]" />
                                        <span className="text-xl font-bold text-[var(--text)] dark:text-[var(--text)]">10M+</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest">Files Converted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
