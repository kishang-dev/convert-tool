import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Scale, FileCheck, Info, AlertTriangle, HelpCircle } from "lucide-react";

export default function TermsPage() {
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
                        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] shadow-xl shadow-indigo-500/20 mb-8 transform rotate-6">
                            <Scale className="text-white" size={32} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">Terms of Service</h1>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em] opacity-70">Effective Date: March 28, 2024</p>
                    </div>

                    <div className="max-w-none bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-16 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                            <FileCheck size={200} />
                        </div>

                        <div className="space-y-12 relative z-10">
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 font-black">01</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Acceptance of Terms</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    By accessing or using Converter Tool, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 font-black">02</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Use License</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg mb-6">
                                    Permission is granted to temporarily use our services for personal or commercial data processing. This is the grant of a license, not a transfer of title, and under this license, you may not:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 border-l-2 border-indigo-500/30">
                                    <p>&bull; Modify or copy the materials</p>
                                    <p>&bull; Use for any unlawful purpose</p>
                                    <p>&bull; Decompile or reverse engineer core software</p>
                                    <p>&bull; Transfer data to another server</p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30 font-black">03</div>
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">AI Content Generation</h2>
                                </div>
                                <div className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Info size={18} className="text-amber-500" />
                                        <span className="font-black uppercase text-xs tracking-widest text-white">Critical Notice</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-400 leading-relaxed">
                                        For AI-generated content (like flowcharts and charts), we do not guarantee 100% accuracy. The output is provided "as is" and remains the responsibility of the user to verify before final implementation.
                                    </p>
                                </div>
                            </section>

                            <section className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/20">
                                <div className="flex items-center gap-4 mb-6">
                                    <AlertTriangle className="text-red-500" size={24} />
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Disclaimer</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    The materials on Converter Tool are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <HelpCircle className="text-blue-500" size={24} />
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Support & Governance</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-normal text-lg">
                                    Any claim relating to Converter Tool shall be governed by the laws of India without regard to its conflict of law provisions. For support, please reach out via our contact page.
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
