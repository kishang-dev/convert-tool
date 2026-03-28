import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText, Sparkles } from "lucide-react";

export default function PrivacyPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] shadow-xl shadow-blue-500/20 mb-8">
                            <Shield className="text-white" size={32} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">Privacy Policy</h1>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em] opacity-70">Last Updated: March 2024</p>
                    </div>

                    <div className="max-w-none bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <FileText size={200} />
                        </div>

                        <div className="space-y-12 relative z-10">
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 font-black">01</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Introduction</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    Welcome to Converter Tool. Your privacy is paramount. This policy details how we handle the information you provide when using our suite of data conversion and processing tools. By using our services, you agree to the collection and use of information in accordance with this policy.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 font-black">02</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Data Collection</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg mb-6">
                                    We collect minimal data necessary to provide a high-quality service:
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start text-gray-400">
                                        <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mt-1 flex-shrink-0">
                                            <Sparkles size={12} />
                                        </div>
                                        <span><strong>Account Info:</strong> Email address and name for registered users.</span>
                                    </li>
                                    <li className="flex gap-4 items-start text-gray-400">
                                        <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mt-1 flex-shrink-0">
                                            <Sparkles size={12} />
                                        </div>
                                        <span><strong>Technical Data:</strong> IP address, browser type, and usage patterns for performance optimization.</span>
                                    </li>
                                    <li className="flex gap-4 items-start text-gray-400">
                                        <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mt-1 flex-shrink-0">
                                            <Sparkles size={12} />
                                        </div>
                                        <span><strong>Transient Files:</strong> Files uploaded for conversion are processed in a secure environment and automatically deleted after a set period.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 font-black">03</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Security Measures</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    We employ cutting-edge security protocols to prevent unauthorized access, alteration, disclosure, or destruction of your personal data. This includes end-to-end encryption for file transfers and restricted access to our processing servers.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6 mt-8">
                                    <div className="p-6 bg-blue-600/5 rounded-[2rem] border border-blue-500/10 flex flex-col items-center text-center">
                                        <Lock size={32} className="text-blue-500 mb-4" />
                                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-2">TLS 1.3 Encryption</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Industry standard for safe data transmission</p>
                                    </div>
                                    <div className="p-6 bg-purple-600/5 rounded-[2rem] border border-purple-500/10 flex flex-col items-center text-center">
                                        <Eye size={32} className="text-purple-500 mb-4" />
                                        <h4 className="font-black text-white uppercase text-xs tracking-widest mb-2">24h Auto-Delete</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Ephemeral processing ensures data privacy</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 font-black">04</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Cookies</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    We use cookies to enhance your experience, remember your preferences, and track anonymous usage statistics. You can control cookie settings in your browser at any time.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
