import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";
import { Users, Shield, Zap, Sparkles, Globe, Heart } from "lucide-react";

export default function AboutPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
                            <Sparkles size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Our Mission</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black gradient-text tracking-tighter mb-8 leading-[1.1]">
                            Revolutionizing <br className="hidden sm:block" /> Modern Workflows
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                            We are building the world's most powerful, AI-driven conversion engine to help creators, engineers, and businesses transform data with precision and style.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-white/5 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="group">
                                <div className="w-16 h-16 bg-blue-600/20 rounded-[1.5rem] flex items-center justify-center border border-blue-500/30 mb-8 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                                    <Shield className="text-blue-400 group-hover:text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Security First</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    Your data is your most valuable asset. We use enterprise-grade encryption and privacy-focused processing for every single conversion.
                                </p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 bg-purple-600/20 rounded-[1.5rem] flex items-center justify-center border border-purple-500/30 mb-8 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-500">
                                    <Zap className="text-purple-400 group-hover:text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Velocity Driven</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    Speed shouldn't compromise quality. Our advanced infrastructure ensures lightning-fast processing across all file types.
                                </p>
                            </div>
                            <div className="group">
                                <div className="w-16 h-16 bg-pink-600/20 rounded-[1.5rem] flex items-center justify-center border border-pink-500/30 mb-8 group-hover:scale-110 group-hover:bg-pink-600 transition-all duration-500">
                                    <Users className="text-pink-400 group-hover:text-white" size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">User Centric</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    We design tools that feel human. Every feature is polished to perfection to ensure the best possible user experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 md:py-32">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="space-y-8 md:space-y-12">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tighter uppercase leading-tight text-center md:text-left">Who We Are</h2>
                            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8 text-center md:text-left">
                                Founded in 2024, Converter Tool started with a simple belief: file conversion shouldn't be a chore. Most tools on the market are slow, filled with intrusive ads, and look like they belong in the early 2000s. We decided to change that.
                            </p>
                            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 md:mb-12 text-center md:text-left">
                                Today, we provide a comprehensive suite of tools ranging from simple PDF conversions to advanced AI-powered Flowchart generation and CV building. Our team consists of passionate developers and designers dedicated to pushing the boundaries of what's possible in a browser.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 mb-20">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Globe className="text-blue-500" size={24} />
                                        <span className="text-2xl font-black">100+</span>
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em] opacity-70">Last Updated: March 2024</p>
                                </div>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Heart className="text-pink-500" size={24} />
                                        <span className="text-2xl font-black">10M+</span>
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Files Converted</p>
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
