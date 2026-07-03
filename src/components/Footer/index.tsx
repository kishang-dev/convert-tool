import React from 'react';
import Link from 'next/link';
import { Mail, Shield, FileText, Info, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full bg-[var(--surface)] dark:bg-[#0a0a0f] border-t border-[var(--border)] pt-20 pb-10 px-4 sm:px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded group-hover:rotate-12 transition-transform shadow-lg shadow-[0_0_0_1px_var(--accent-ring)]">
                                <Sparkles className="text-[var(--text)] dark:text-[var(--text)]" size={20} />
                            </div>
                            <span className="text-xl font-black text-[var(--text)] dark:text-[var(--text)] tracking-tight uppercase">ToolBasketAI</span>
                        </Link>
                        <p className="text-[var(--text-muted)] dark:text-[var(--text-muted)] text-sm leading-relaxed font-medium mx-auto md:mx-0 max-w-sm md:max-w-none">
                            The world's most advanced AI-powered conversion platform. Transforming how you handle documents, one file at a time.
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-[var(--text-faint)] dark:text-[var(--text-faint)]">
                            <Link href="#" className="hover:text-blue-500 transition-colors"><Globe size={20} /></Link>
                            <Link href="/contact" className="hover:text-blue-500 transition-colors"><Mail size={20} /></Link>
                        </div>
                    </div>

                    {/* Tools Section */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-[var(--text)] dark:text-[var(--text)] uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60">Core Tools</h4>
                        <ul className="space-y-4">
                            <li><Link href="/tools" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors">All Converters</Link></li>
                            <li><Link href="/drowChart" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors">AI Chart maker</Link></li>
                            <li><Link href="/resume-builder" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors">CV Architect</Link></li>
                            <li><Link href="/ocr" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors">Precision OCR</Link></li>
                        </ul>
                    </div>

                    {/* Company Section */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-[var(--text)] dark:text-[var(--text)] uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60">Ecosystem</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Info size={16} /> About Us
                            </Link></li>
                            <li><Link href="/contact" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Mail size={16} /> Contact
                            </Link></li>
                            <li><Link href="/privacy" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <Shield size={16} /> Privacy
                            </Link></li>
                            <li><Link href="/terms" className="text-[var(--text-muted)] dark:text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center md:justify-start gap-3">
                                <FileText size={16} /> Terms
                            </Link></li>
                        </ul>
                    </div>

                    {/* Newsletter/Status */}
                    <div className="text-center md:text-left">
                        <h4 className="text-xs font-black text-[var(--text)] dark:text-[var(--text)] uppercase tracking-[0.2em] mb-6 md:mb-8 opacity-60 text-center md:text-left">System Status</h4>
                        <div className="p-6 bg-[var(--surface)] dark:bg-[var(--accent-soft)] border border-[var(--border)] dark:border-[var(--border)] rounded space-y-4 max-w-sm mx-auto md:mx-0">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest">All Engines Operational</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-faint)] dark:text-[var(--text-faint)] leading-relaxed font-bold uppercase text-center md:text-left">
                                Optimized for Google AdSense & Search Visibility
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[var(--border)] pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-black text-[var(--text-faint)] dark:text-[var(--text-faint)] uppercase tracking-[0.2em]">
                        &copy; 2026 ToolBasketAI Tools. Crafted for Performance.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] uppercase tracking-widest transition-colors">Security</Link>
                        <Link href="/terms" className="text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text)] dark:text-[var(--text)] uppercase tracking-widest transition-colors">Compliance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
