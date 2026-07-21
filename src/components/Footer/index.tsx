import React from 'react';
import Link from 'next/link';
import { FiTwitter, FiFacebook, FiLinkedin, FiInstagram } from 'react-icons/fi';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[var(--surface)] border-t border-[var(--border)] pt-14 pb-9 px-6">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 mb-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3.5">
                            <div
                                className="w-[34px] h-[34px] rounded-[10px] grid place-items-center shadow-lg"
                                style={{ background: 'linear-gradient(135deg, var(--accent), #8B5CF6)', boxShadow: '0 6px 16px color-mix(in srgb, var(--accent) 40%, transparent)' }}
                            >
                                <Image
                                    src="/assets/logo1.png"
                                    alt="ToolBasketAI Logo"
                                    width={38}
                                    height={38}
                                    className="w-[38px] h-[38px] object-contain"
                                />
                            </div>
                            <span className="font-[800] text-[17px] text-[var(--text)] font-['Sora',sans-serif]">
                                ToolBasket<span className="text-[var(--accent)]">AI</span>
                            </span>
                        </div>
                        <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed max-w-[300px] m-0 font-['Poppins',sans-serif]">
                            Your all-in-one online toolkit. Convert, merge, split and process PDFs, images and documents. All files are deleted within 1 Week.
                        </p>
                    </div>

                    {/* Core Tools */}
                    <div>
                        <h4 className="font-['Sora',sans-serif] font-bold text-[14px] mb-3.5 text-[var(--text)]">Core Tools</h4>
                        <div className="flex flex-col gap-2.5">
                            {[
                                { name: 'All Tools', path: '/#tb-tools' },
                                { name: 'AI Chart Maker', path: '/drowChart' },
                                { name: 'AI Resume Builder', path: '/resume-builder' },
                                { name: 'Precision OCR', path: '/ocr' },
                                { name: 'Merge PDF', path: '/merge-pdf' }
                            ].map(link => (
                                <Link
                                    href={link.path}
                                    key={link.name}
                                    className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-['Sora',sans-serif] font-bold text-[14px] mb-3.5 text-[var(--text)]">Company</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link href="/about" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">About Us</Link>
                            <Link href="/contact" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Contact</Link>
                            <Link href="/blog" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Blog</Link>
                            <Link href="/privacy" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-['Sora',sans-serif] font-bold text-[14px] mb-3.5 text-[var(--text)]">Support</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link href="/contact" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Help Center</Link>
                            {/* <Link href="#" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">System Status</Link> */}
                            <Link href="/contact" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Suggest a Tool</Link>
                            <Link href="/contact" className="text-[13.5px] text-[var(--text-muted)] font-['Poppins',sans-serif] hover:text-[var(--accent)] transition-colors">Report a Bug</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between gap-5 flex-wrap mt-10 pt-6 border-t border-[var(--border)]">
                    <span className="text-[13px] text-[var(--text-muted)] font-['Poppins',sans-serif]">
                        © 2026 ToolBasketAI. All rights reserved.
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-[13px] text-[var(--text-muted)] font-medium font-['Poppins',sans-serif]">
                            Show us some love
                        </span>
                        {[
                            // { icon: FiTwitter, label: 'Twitter', href: '#' },
                            // { icon: FiFacebook, label: 'Facebook', href: '#' },
                            { icon: FiLinkedin, label: 'LinkedIn', href: 'http://www.linkedin.com/in/toolbasketai' },
                            { icon: FiInstagram, label: 'Instagram', href: 'https://www.instagram.com/toolbasketai/' },
                        ].map(({ icon: Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-9 h-9 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] grid place-items-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

