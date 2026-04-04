import React from 'react';
import Link from 'next/link';
import { Mail, Shield, FileText, Info, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0a0f] border-t border-white/5 pt-20 pb-10 px-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black text-white tracking-tight uppercase">QuickPDF</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed font-medium mx-auto md:mx-0 max-w-sm md:max-w-none">
                            The world's most advanced AI-powered conversion platform. Transforming how you handle documents, one file at a time.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-gray-500">
                            <Link href="#" className="hover:text-blue-500 transition-colors"><Globe size={20} /></Link>
                            <Link href="/contact" className="hover:text-blue-500 transition-colors"><Mail size={20} /></Link>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60">Core Tools</h4>
                        <ul className="space-y-4">
                            <li><Link href="/tools" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">All Converters</Link></li>
                            <li><Link href="/drowChart" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">AI Chart maker</Link></li>
                            <li><Link href="/resume-builder" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">CV Architect</Link></li>
                            <li><Link href="/ocr" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors">Precision OCR</Link></li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60">Ecosystem</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Info size={16} /> About Us
                            </Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Mail size={16} /> Contact
                            </Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Shield size={16} /> Privacy
                            </Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <FileText size={16} /> Terms
                            </Link></li>
                        </ul>
                    </div>

                    {/* Newsletter/Status */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60 text-center md:text-left">System Status</h4>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 max-w-sm mx-auto md:mx-0">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">All Engines Operational</span>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase text-center md:text-left">
                                Optimized for Google AdSense & Search Visibility
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                        &copy; 2026 QuickPDF Tools. Crafted for Performance.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Security</Link>
                        <Link href="/terms" className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Compliance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
